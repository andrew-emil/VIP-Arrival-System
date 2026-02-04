import { PrismaClient, MatchType, CameraSource, AuditEventType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter })


async function main() {
    console.log('🌱 Seeding database (Milestone 2)...');

    await prisma.$connect();

    /* =======================
       Cameras (3)
       ======================= */
    await prisma.camera.createMany({
        data: [
            { id: 'CAM-01', name: 'Main Gate' },
            { id: 'CAM-02', name: 'Side Gate' },
            { id: 'CAM-03', name: 'Parking' },
        ],
        skipDuplicates: true,
    });

    /* =======================
       VIPs (10)
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

    await prisma.vip.createMany({
        data: vips.map((plate, i) => ({
            plateNormalized: plate,
            name: `VIP ${i + 1}`,
            active: true,
        })),
        skipDuplicates: true,
    });

    const vipABC = await prisma.vip.findUnique({
        where: { plateNormalized: 'ABC123' },
    });

    const vip777 = await prisma.vip.findUnique({
        where: { plateNormalized: 'VIP777' },
    });

    /* =======================
       PlateReads (5)
       ======================= */
    const now = new Date();

    const reads = [
        // ✅ VIP match #1 (with timestamp)
        {
            plateRaw: 'ABC 123',
            plateNormalized: 'ABC123',
            cameraId: 'CAM-01',
            readAt: new Date(now.getTime() - 1000 * 60 * 10),
            receivedAt: now,
            isVip: true,
            matchType: MatchType.exact,
            vipId: vipABC?.id,
        },

        // ✅ VIP match #2 (no timestamp → readAt = receivedAt)
        {
            plateRaw: 'vip-777',
            plateNormalized: 'VIP777',
            cameraId: 'CAM-02',
            readAt: null,
            receivedAt: new Date(now.getTime() - 1000 * 60 * 5),
            isVip: true,
            matchType: MatchType.exact,
            vipId: vip777?.id,
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
        },

        // ❌ Non-VIP #2
        {
            plateRaw: 'CAR-101',
            plateNormalized: 'CAR101',
            cameraId: 'CAM-01',
            readAt: new Date(now.getTime() - 1000 * 60 * 20),
            receivedAt: new Date(now.getTime() - 1000 * 60 * 2),
            isVip: false,
            matchType: MatchType.none,
            vipId: null,
        },

        // ❌ Non-VIP #3
        {
            plateRaw: 'TEST 555',
            plateNormalized: 'TEST555',
            cameraId: 'CAM-02',
            readAt: null,
            receivedAt: new Date(now.getTime() - 1000 * 60 * 1),
            isVip: false,
            matchType: MatchType.none,
            vipId: null,
        },
    ];

    for (const r of reads) {
        const plateRead = await prisma.plateRead.create({
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
                rawPayload: { seed: true, plate: r.plateRaw },
            },
        });

        /* =======================
           Audit Logs (3 per read)
           ======================= */
        await prisma.auditLog.createMany({
            data: [
                {
                    plateReadId: plateRead.id,
                    eventType: AuditEventType.received,
                },
                {
                    plateReadId: plateRead.id,
                    eventType: AuditEventType.normalized,
                },
                {
                    plateReadId: plateRead.id,
                    eventType: AuditEventType.matched,
                },
            ],
        });
    }

    console.log('✅ Seed completed successfully');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
