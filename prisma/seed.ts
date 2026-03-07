import { PrismaClient, MatchType, CameraSource, AuditEventType, UserRole, CameraRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pino from 'pino';

const logger = pino({
    transport: { target: 'pino-pretty', options: { colorize: true } }
});

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter })

async function main() {
    logger.info('🌱 Seeding database (Milestone 2 & 3)...');

    await prisma.$connect();

    /* =======================
       Admin User
       ======================= */
    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                name: 'System Admin',
                email: adminEmail,
                role: UserRole.Admin,
                passwordHash: '$2a$10$dummyhash...', // In a real app, hash carefully
            }
        });
        logger.info('Created default Admin user.');
    }

    /* =======================
       Sample Event
       ======================= */
    const event = await prisma.event.create({
        data: {
            name: 'Annual Tech Gala',
            startTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
            endTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 10), // 10 hours from now
        }
    });
    logger.info(`Created sample Event: ${event.name}`);

    /* =======================
       Cameras (3)
       ======================= */
    const cams = await Promise.all([
        prisma.camera.upsert({
            where: { id: 'CAM-01' },
            create: { id: 'CAM-01', name: 'Main Gate', role: CameraRole.gate, eventId: event.id },
            update: { role: CameraRole.gate, eventId: event.id }
        }),
        prisma.camera.upsert({
            where: { id: 'CAM-02' },
            create: { id: 'CAM-02', name: 'Side Gate', role: CameraRole.gate, eventId: event.id },
            update: { role: CameraRole.gate, eventId: event.id }
        }),
        prisma.camera.upsert({
            where: { id: 'CAM-03' },
            create: { id: 'CAM-03', name: 'Approach Road', role: CameraRole.approach, eventId: event.id },
            update: { role: CameraRole.approach, eventId: event.id }
        })
    ]);

    /* =======================
       VIPs (10) & Plates
       ======================= */
    const vips = [
        'ABC123', // will match
        'VIP777', // will match
        'VIP001',
        'VIP002',
        'VIP003',
        'VIP004',
        'VIP005',
        'VIP006',
        'VIP007',
        'VIP008',
    ];

    for (let i = 0; i < vips.length; i++) {
        const plateStr = vips[i];

        await prisma.vip.create({
            data: {
                name: `VIP ${i + 1}`,
                active: true,
                eventId: event.id,
                plates: {
                    connectOrCreate: {
                        where: { plateNumber: plateStr },
                        create: { plateNumber: plateStr }
                    }
                }
            }
        });
    }

    const vipABC_Plate = await prisma.plate.findUnique({
        where: { plateNumber: 'ABC123' },
        include: { vip: true }
    });

    const vip777_Plate = await prisma.plate.findUnique({
        where: { plateNumber: 'VIP777' },
        include: { vip: true }
    });

    /* =======================
       PlateEvents (formerly PlateReads)
       ======================= */
    const now = new Date();

    const reads = [
        // ✅ VIP match #1
        {
            plateRaw: 'ABC 123',
            plateNormalized: 'ABC123',
            cameraId: 'CAM-01',
            readAt: new Date(now.getTime() - 1000 * 60 * 10),
            receivedAt: now,
            isVip: true,
            matchType: MatchType.exact,
            vipId: vipABC_Plate?.vipId,
            plateId: vipABC_Plate?.id,
        },
        // ✅ VIP match #2
        {
            plateRaw: 'vip-777',
            plateNormalized: 'VIP777',
            cameraId: 'CAM-02',
            readAt: null,
            receivedAt: new Date(now.getTime() - 1000 * 60 * 5),
            isVip: true,
            matchType: MatchType.exact,
            vipId: vip777_Plate?.vipId,
            plateId: vip777_Plate?.id,
        },
        // ❌ Non-VIP #1
        {
            plateRaw: 'ZZZ 999',
            plateNormalized: 'ZZZ999',
            cameraId: 'CAM-03',
            readAt: null,
            receivedAt: new Date(now.getTime() - 1000 * 60 * 3),
            isVip: false,
            matchType: MatchType.none,
            vipId: null,
            plateId: null,
        },
    ];

    for (const r of reads) {
        const plateEvt = await prisma.plateEvent.create({
            data: {
                plateRaw: r.plateRaw,
                plateNormalized: r.plateNormalized,
                cameraId: r.cameraId,
                readAt: r.readAt,
                receivedAt: r.receivedAt,
                confidence: 0.9,
                snapshotUrl: 'https://example.com/snap.jpg',
                source: CameraSource.manual,
                isVip: r.isVip,
                matchType: r.matchType,
                vipId: r.vipId,
                plateId: r.plateId,
                eventId: event.id,
                rawPayload: { seed: true, plate: r.plateRaw },
            },
        });

        /* =======================
           Audit Logs (3 per read)
           ======================= */
        await prisma.auditLog.createMany({
            data: [
                {
                    plateEventId: plateEvt.id,
                    eventId: event.id,
                    eventType: AuditEventType.received,
                },
                {
                    plateEventId: plateEvt.id,
                    eventId: event.id,
                    eventType: AuditEventType.normalized,
                },
                {
                    plateEventId: plateEvt.id,
                    eventId: event.id,
                    eventType: AuditEventType.matched,
                },
            ],
        });
    }

    logger.info('✅ Seed completed successfully');
}

main()
    .catch((e) => {
        logger.error({ err: e }, '❌ Seed failed');
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
