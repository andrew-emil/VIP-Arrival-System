import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngressService } from './ingress.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { QueueService } from '../queue/queue.service';

@ApiTags('Ingress')
@Controller('ingress')
@UseGuards(ApiKeyGuard)
@Public()
export class IngressController {
    constructor(
        private readonly ingressService: IngressService,
        private readonly queueService: QueueService
    ) { }

    @Post("plate-reads")
    @ApiOperation({ summary: 'Handle ALPR plate read events' })
    @ApiBody({ type: Object, description: 'Plate read data (can also accept webhook-specific formats)' })
    @ApiResponse({ status: 201, description: 'Plate read processed successfully' })
    handlePlateRead(@Body() body: any, @Req() req: any) {
        return this.ingressService.handlePlateRead(body, req);
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Receive camera webhook and enqueue' })
    @ApiResponse({ status: 202, description: 'Event accepted and enqueued' })
    async receiveEvent(@Req() req: Request) {
        const camera = (req as any).camera;
        const event = req.body;

        // Enqueue job immediately
        await this.queueService.addPlateReadJob(camera, event);

        // Return 202 Accepted
        return { status: 'accepted' };
    }
}
