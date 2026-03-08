import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export function verifyHmac(secret: string) {
    return (req: Request, res: Response, next: NextFunction) => {

        const signature = req.headers['x-signature'] as string;
        const payload = JSON.stringify(req.body);

        const computed = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        if (computed !== signature) {
            return res.status(401).send('Invalid signature');
        }

        next();
    };
}