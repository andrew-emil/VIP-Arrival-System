import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
    private readonly logger = new Logger(QueueService.name);

    constructor(
        @InjectQueue('plate-reads')
        private readonly plateReadsQueue: Queue
    ) { }

    async addPlateReadJob(camera: any, event: any) {
        this.logger.debug(`Enqueueing plate read for camera ${camera.id}`);
        // Enqueue with a unique job ID based on idempotency key if present
        const jobId = event.idempotencyKey ?? event.idempotency_key ?? event.event_id;

        await this.plateReadsQueue.add(
            'process-plate',
            { camera, event },
            {
                jobId,
                removeOnComplete: true,
                removeOnFail: false,
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
            }
        );
    }
}
