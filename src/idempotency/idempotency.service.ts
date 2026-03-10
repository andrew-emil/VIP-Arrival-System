import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class IdempotencyService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) { }

    /**
     * Computes idempotency key:
     * hash(eventId + cameraId + plate + ts_bucket_3s)
     */
    makeKey(eventId: string | undefined, cameraId: string, plate: string, timestamp: Date | number) {
        const ts = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
        const bucket = Math.floor(ts / 3000); // 3-second bucket
        const raw = `${eventId ?? ''}::${cameraId}::${plate}::${bucket}`;
        return crypto.createHash('sha256').update(raw).digest('hex');
    }

    /**
     * Returns true if it was a duplicate (i.e., already seen).
     * If not seen, stores it and returns false.
     */
    async checkAndStore(key: string, ttlSeconds = 10): Promise<boolean> {
        const exists = await this.cache.get(key);
        if (exists) return true;
        await this.cache.set(key, true, ttlSeconds); // ttl in seconds
        return false;
    }
}