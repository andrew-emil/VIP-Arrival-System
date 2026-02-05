import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateVipDto } from './dto/createVip.dto';
import { normalizePlate } from 'src/core/utils/plate-normalizer';

@Injectable()
export class VipService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(createVipDto: CreateVipDto) {
        const { plate, name } = createVipDto;
        const plateNormalized = plate.trim().toUpperCase();

        const existingVip = await this.prisma.vip.findUnique({
            where: { plateNormalized },
        });

        if (existingVip) {
            throw new ConflictException('VIP already exists');
        }

        return this.prisma.vip.create({
            data: {
                plateNormalized,
                name: name ? name.trim() : null,
            },
        });
    }

    async listVips(plate?: string) {
        const where = plate
            ? {
                plateNormalized: {
                    contains: normalizePlate(plate),
                },
            }
            : undefined;

        const items = await this.prisma.vip.findMany({
            where,
            orderBy: { plateNormalized: 'asc' },
            take: 200,
        });

        return {
            items: items.map((v) => ({
                id: v.id,
                plateNormalized: v.plateNormalized,
                name: v.name,
                active: v.active,
            })),
        };
    }
}
