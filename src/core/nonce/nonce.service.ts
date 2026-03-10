import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class NonceService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache
    ) { }

    async validate(nonce: string) {
        const exists = await this.cache.get(nonce);
        if (exists) {
            throw new UnauthorizedException('Replay attack');
        }

        await this.cache.set(nonce, true, );
    }
}
