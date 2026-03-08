import { PrismaClient, Role, CameraRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pino from 'pino';
import * as bcrypt from 'bcrypt';

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
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL!;
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD!;

    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                name: 'System Admin',
                email: adminEmail,
                role: Role.ADMIN,
                passwordHash,
            }
        });
        logger.info(`Created default Admin user: ${adminEmail}`);
    } else {
        logger.info(`Admin user ${adminEmail} already exists.`);
    }

    /* =======================
       Sample Event
       ======================= */
    const event = await prisma.event.create({
        data: {
            name: 'Annual Tech Gala',
            startTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
            endTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 10), // 10 hours from now
            status: 'active',
        }
    });
    logger.info(`Created sample Event: ${event.name}`);

    /* =======================
       Cameras (3)
       ======================= */
    const cams = await Promise.all([
        prisma.camera.create({ data: { id: 'CAM-01', name: 'Main Gate', role: CameraRole.GATE, eventId: event.id } }),
        prisma.camera.create({ data: { id: 'CAM-02', name: 'Side Gate', role: CameraRole.GATE, eventId: event.id } }),
        prisma.camera.create({ data: { id: 'CAM-03', name: 'Approach Road', role: CameraRole.APPROACH, eventId: event.id } })
    ]);

    /* =======================
       VIPs (10) & Plates
       ======================= */
    const vips = [
        'ABC123', // will match
        'VIP777', // will match
        'VIP001',
    ];

    for (let i = 0; i < vips.length; i++) {
        const plateStr = vips[i];

        await prisma.vIP.create({
            data: {
                name: `VIP ${i + 1}`,
                eventId: event.id,
                plates: {
                    create: { plateNumber: plateStr }
                }
            }
        });
    }

    /* =======================
       PlateEvents
       ======================= */
    const now = new Date();

    const reads = [
        // ✅ VIP match #1
        {
            plate: 'ABC123',
            cameraId: 'CAM-01',
            timestamp: new Date(now.getTime() - 1000 * 60 * 10),
            idempotencyKey: 'IDEM-1',
            eventId: event.id,
            confidence: 0.95
        },
        // ✅ VIP match #2
        {
            plate: 'VIP777',
            cameraId: 'CAM-02',
            timestamp: new Date(now.getTime() - 1000 * 60 * 5),
            idempotencyKey: 'IDEM-2',
            eventId: event.id,
            confidence: 0.9
        },
        // ❌ Non-VIP #1
        {
            plate: 'ZZZ999',
            cameraId: 'CAM-03',
            timestamp: new Date(now.getTime() - 1000 * 60 * 3),
            idempotencyKey: 'IDEM-3',
            eventId: event.id,
            confidence: 0.8
        },
    ];

    for (const r of reads) {
        const plateEvt = await prisma.plateEvent.create({
            data: {
                ...r
            },
        });

        /* =======================
           Audit Logs
           ======================= */
        await prisma.auditLog.create({
            data: {
                action: 'PLATE_READ_RECEIVED',
                meta: { plateEventId: plateEvt.id, eventId: event.id },
            },
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
