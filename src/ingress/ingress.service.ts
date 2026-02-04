// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../core/prisma/prisma.service';
// import { normalizePlate } from '../core/utils/plate-normalizer';
// import { PlateReadDto } from './dto/plateRead.dto';

// @Injectable()
// export class IngressService {
//     constructor(private readonly prisma: PrismaService) { }

//     async handlePlateRead(payload: PlateReadDto) {
//         const receivedAt = new Date();

//         const plateRaw: string = payload?.plate ?? '';
//         const plateNormalized = normalizePlate(plateRaw);

//         const cameraId: string = payload?.cameraId ?? 'unknown';
//         const readAt = payload?.timestamp ? new Date(payload.timestamp) : null;

//         const processingLogs: any[] = [];
//         const warnings: string[] = [];

//         processingLogs.push({ event: 'received', at: receivedAt });

//         processingLogs.push({
//             event: 'normalized',
//             plateRaw,
//             plateNormalized,
//         });

//         // Camera lookup (soft)
//         const camera = await this.prisma.camera.findUnique({
//             where: { id: cameraId },
//         });

//         const cameraKnown = !!camera;
//         if (!cameraKnown) {
//             warnings.push('unknown_camera');
//         }

//         // VIP matching
//         const vip = await this.prisma.vip.findFirst({
//             where: {
//                 plateNormalized,
//                 active: true,
//             },
//         });

//         const isVip = !!vip;

//         processingLogs.push({
//             event: isVip ? 'vip_matched_exact' : 'vip_not_matched',
//             vipId: vip?.id ?? null,
//         });

//         const plateRead = await this.prisma.plateRead.create({
//             data: {
//                 plateRaw,
//                 plateNormalized,
//                 readAt,
//                 receivedAt,
//                 cameraId,
//                 cameraKnown,
//                 isVip,
//                 matchType: isVip ? 'exact' : 'none',
//                 vipId: vip?.id ?? null,
//                 // @ts-expect-error: PlateReadDto missing index signature for Prisma InputJsonValue
//                 rawPayload: payload,
//                 processingLogs,
//                 warnings,
//             },
//         });

//         return {
//             id: plateRead.id,
//             isVip: plateRead.isVip,
//             receivedAt: plateRead.receivedAt,
//         };
//     }
// }
