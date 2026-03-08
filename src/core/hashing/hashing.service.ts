import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class HashingService {
    constructor(private readonly config: ConfigService) { }

    async hashPassword(password: string): Promise<string> {
        const roundsRaw = this.config.get('BCRYPT_ROUNDS', 12);
        const rounds = typeof roundsRaw === 'string' ? parseInt(roundsRaw, 10) : roundsRaw;

        if (!Number.isFinite(rounds) || rounds < 4) {
            throw new Error(`Invalid BCRYPT_ROUNDS: ${roundsRaw}`);
        }

        return await bcrypt.hash(password, rounds as number);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    hashToken(token: string) {
        const secret = this.config.get<string>('RESET_TOKEN_SECRET');
        if (!secret) throw new Error('RESET_TOKEN_SECRET is not set');

        return crypto.createHmac('sha256', secret).update(token).digest('hex');
    }
}
