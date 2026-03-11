import crypto from 'crypto';
import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'
import { CameraService } from 'src/camera/camera.service';
import { NonceService } from '../nonce/nonce.service';

@Injectable()
export class WebhookSecurityMiddleware implements NestMiddleware {
    private readonly logger = new Logger(WebhookSecurityMiddleware.name);

    constructor(
        private readonly nonceService: NonceService,
        private readonly cameraService: CameraService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const signature = (req.headers['x-signature'] as string) ?? '';
        const nonce = (req.headers['x-nonce'] as string) ?? '';
        const tsHeader = (req.headers['x-timestamp'] as string) ?? '';
        const payload = JSON.stringify(req.body || {});

        if (!signature || !nonce) {
            throw new UnauthorizedException('Missing signature or nonce');
        }
        if (!tsHeader) {
            // you can require timestamp to prevent replay across long time windows
            this.logger.debug('x-timestamp header missing; continuing without timestamp check');
        }
        const secret = process.env.CAMERA_WEBHOOK_SECRET!;
        const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex');

        if (computed !== signature) {
            throw new UnauthorizedException('Invalid signature');
        }
        await this.nonceService.validate(nonce);
        const camera = await this.cameraService.getCameraByIp(req.ip as string);

        try {
            await this.cameraService.touchLastSeen(camera.id);
        } catch (err) {
            this.logger.warn(`Failed to update camera.lastSeen for ${camera.id}: ${err}`);
        }

        // attach camera to request for controller downstream
        (req as any).camera = camera;

        next();
    }
}