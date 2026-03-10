import { PrismaClient, Role, CameraRole, SessionStatus, vip } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pino from 'pino';
import bcrypt from 'bcrypt';
import pg from 'pg';

const logger = pino({
    transport: { target: 'pino-pretty', options: { colorize: true } }
});

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter })

async function main() {
    logger.info('🌱 Seeding database...');

    await prisma.$connect();

    /* =======================
       Admin User
       ======================= */
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123!';

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
            name: 'Annual Tech Gala 2026',
            startTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
            endTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 10), // 10 hours from now
            status: 'ACTIVE',
            window: 480
        }
    });
    logger.info(`Created sample Event: ${event.name}`);

    /* =======================
       Cameras (3)
       ======================= */
    const cam01Id = '11111111-1111-1111-1111-111111111111';
    const cam02Id = '22222222-2222-2222-2222-222222222222';
    const cam03Id = '33333333-3333-3333-3333-333333333333';

    const cams = await Promise.all([
        prisma.camera.create({
            data: {
                id: cam01Id,
                name: 'Main Gate',
                role: CameraRole.GATE,
                eventId: event.id,
                ip: '192.168.1.101',
                location: 'Main Entrance North'
            }
        }),
        prisma.camera.create({
            data: {
                id: cam02Id,
                name: 'Side Gate',
                role: CameraRole.GATE,
                eventId: event.id,
                ip: '192.168.1.102',
                location: 'Service Entrance West'
            }
        }),
        prisma.camera.create({
            data: {
                id: cam03Id,
                name: 'Approach Road',
                role: CameraRole.APPROACH,
                eventId: event.id,
                ip: '192.168.1.103',
                location: 'Highway Approach'
            }
        })
    ]);
    logger.info(`Created ${cams.length} Cameras`);

    /* =======================
       VIPs (3) & Plates & Sessions
       ======================= */
    const vipsData = [
        { name: 'Abdullah Al-Falah', company: 'Saudi Tech', plate: 'ABC123', level: 'Royal' },
        { name: 'Sarah Johnson', company: 'Global Events', plate: 'VIP777', level: 'Executive' },
        { name: 'Mohammed Rashid', company: 'Dubai Investments', plate: 'VIP001', level: 'Protocol-1' },
    ];

    const createdVips: vip[] = [];
    for (let i = 0; i < vipsData.length; i++) {
        const data = vipsData[i];
        const vip = await prisma.vip.create({
            data: {
                name: data.name,
                company: data.company,
                protocolLevel: data.level,
                notes: `Special guest for ${event.name}`,
                eventId: event.id,
                plates: {
                    create: { plateNumber: data.plate }
                },
                sessions: {
                    create: {
                        eventId: event.id,
                        status: SessionStatus.REGISTERED
                    }
                }
            }
        });
        createdVips.push(vip);
    }
    logger.info(`Created ${createdVips.length} VIPs with associated Plates and Sessions`);

    /* =======================
       PlateEvents (Historic)
       ======================= */
    const now = new Date();

    const reads = [
        // ✅ VIP match #1 - Approach road
        {
            plate: 'ABC123',
            cameraId: cam03Id,
            timestamp: new Date(now.getTime() - 1000 * 60 * 30),
            idempotencyKey: 'IDEM-HIST-1',
            eventId: event.id,
            confidence: 0.98
        },
        // ✅ VIP match #1 - Arrived at Gate
        {
            plate: 'ABC123',
            cameraId: cam01Id,
            timestamp: new Date(now.getTime() - 1000 * 60 * 15),
            idempotencyKey: 'IDEM-HIST-2',
            eventId: event.id,
            confidence: 0.95
        },
        // ✅ VIP match #2 - Approach road
        {
            plate: 'VIP777',
            cameraId: cam03Id,
            timestamp: new Date(now.getTime() - 1000 * 60 * 5),
            idempotencyKey: 'IDEM-HIST-3',
            eventId: event.id,
            confidence: 0.92
        },
        // ❌ Random car
        {
            plate: 'GUEST-1',
            cameraId: cam01Id,
            timestamp: new Date(now.getTime() - 1000 * 60 * 2),
            idempotencyKey: 'IDEM-HIST-4',
            eventId: event.id,
            confidence: 0.85
        },
    ];

    for (const r of reads) {
        const plateEvt = await prisma.plateEvent.create({
            data: r,
        });

        /* =======================
           Audit Logs
           ======================= */
        await prisma.auditLog.create({
            data: {
                action: 'PLATE_READ_RECEIVED',
                meta: { plateEventId: plateEvt.id, eventId: event.id, plate: r.plate },
            },
        });
    }
    logger.info(`Created ${reads.length} PlateEvents and associated AuditLogs`);

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

