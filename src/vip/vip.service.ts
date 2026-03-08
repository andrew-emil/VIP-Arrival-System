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

        const existingVip = await this.prisma.vIP.findFirst({
            where: { plates: { some: { plateNumber: plateNormalized } } },
        });

        if (existingVip) {
            throw new ConflictException('VIP already exists');
        }

        const activeEvent = await this.prisma.event.findFirst();
        if (!activeEvent) {
            throw new ConflictException('No active event found to assign VIP');
        }

        return this.prisma.vIP.create({
            data: {
                name: name?.trim() ?? 'Unknown',
                eventId: activeEvent.id,
                plates: {
                    create: { plateNumber: plateNormalized }
                }
            },
        });
    }

    async listVips(plate?: string) {
        const where = plate
            ? {
                plates: {
                    some: {
                        plateNumber: {
                            contains: normalizePlate(plate),
                        }
                    }
                },
            }
            : undefined;

        const items = await this.prisma.vIP.findMany({
            where,
            include: { plates: true },
            take: 200,
        });

        return {
            items: items.map((v) => ({
                id: v.id,
                plateNormalized: v.plates.length > 0 ? v.plates[0].plateNumber : 'UNKNOWN',
                name: v.name,
            })),
        };
    }
}
