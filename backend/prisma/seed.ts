import { PrismaPg } from '@prisma/adapter-pg';
import { CameraRole, PrismaClient, Role, SessionStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import pg from 'pg';
import pino from 'pino';

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
    try {
        await prisma.$connect();
        
    }catch(error){
        logger.error('❌ Seed failed', error.message);
        process.exit(1);
    }


    /* =======================
       Admin User
       ======================= */
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL!
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD!

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
       Sample Operator & Manager Users
       ======================= */
    const sampleUsers = [
        { name: 'Ahmad Operator', email: 'operator@example.com', role: Role.OPERATOR },
        { name: 'Sara Manager', email: 'manager@example.com', role: Role.MANAGER },
        { name: 'Omar Observer', email: 'observer@example.com', role: Role.OBSERVER },
    ];

    for (const u of sampleUsers) {
        const existing = await prisma.user.findUnique({ where: { email: u.email } });
        if (!existing) {
            const passwordHash = await bcrypt.hash('Password123!', 10);
            await prisma.user.create({
                data: { name: u.name, email: u.email, role: u.role, passwordHash }
            });
            logger.info(`Created sample user: ${u.email} (${u.role})`);
        } else {
            logger.info(`User ${u.email} already exists.`);
        }
    }

    /* =======================
       Sample Event
       ======================= */
    let event = await prisma.event.findFirst({ where: { name: 'Annual Tech Gala 2026' } });
    if (!event) {
        event = await prisma.event.create({
            data: {
                name: 'Annual Tech Gala 2026',
                startTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
                endTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 10),  // 10 hours from now
                status: 'ACTIVE',
                window: 480
            }
        });
        logger.info(`Created sample Event: ${event.name}`);
    } else {
        logger.info(`Event '${event.name}' already exists.`);
    }

    /* =======================
       Cameras (3)
       ======================= */
    const cameraSeeds = [
        { id: randomUUID(), name: 'Main Gate',     role: CameraRole.GATE,     ip: '192.168.1.105', location: 'Main Entrance North' },
        { id: randomUUID(), name: 'Side Gate',     role: CameraRole.GATE,     ip: '192.168.1.106', location: 'Service Entrance West' },
        { id: randomUUID(), name: 'Approach Road', role: CameraRole.APPROACH, ip: '192.168.1.107', location: 'Highway Approach' },
    ];

    const cams: { id: string; name: string; ip: string; role: CameraRole; location: string | null; eventId: string; lastSeen: Date | null; }[] = [];
    for (const c of cameraSeeds) {
        const existing = await prisma.camera.findUnique({ where: { ip: c.ip } });
        if (!existing) {
            const created = await prisma.camera.create({
                data: { id: c.id, name: c.name, role: c.role, ip: c.ip, location: c.location, eventId: event.id }
            });
            cams.push(created);
            logger.info(`Created Camera: ${created.name} (${created.ip})`);
        } else {
            cams.push(existing);
            logger.info(`Camera ${c.name} (${c.ip}) already exists.`);
        }
    }

    const cam01 = cams[0]; // Main Gate
    const cam02 = cams[1]; // Side Gate
    const cam03 = cams[2]; // Approach Road

    /* =======================
       Device Accounts (one per camera)
       ======================= */
    const deviceSeeds = [
        { name: 'Main Gate Device',     cameraIp: cam01.ip, deviceId: 'DEVICE-MAIN-GATE-01' },
        { name: 'Side Gate Device',     cameraIp: cam02.ip, deviceId: 'DEVICE-SIDE-GATE-01' },
        { name: 'Approach Road Device', cameraIp: cam03.ip, deviceId: 'DEVICE-APPROACH-01'  },
    ];

    for (const d of deviceSeeds) {
        const cam = cams.find(c => c.ip === d.cameraIp)!;
        const existing = await prisma.deviceAccount.findUnique({ where: { deviceId: d.deviceId } });
        if (!existing) {
            await prisma.deviceAccount.create({
                data: { name: d.name, deviceId: d.deviceId, cameraId: cam.id, isActive: true }
            });
            logger.info(`Created DeviceAccount: ${d.name}`);
        } else {
            logger.info(`DeviceAccount ${d.deviceId} already exists.`);
        }
    }

    /* =======================
       VIPs (3) & Plates & Sessions
       3 statuses: REGISTERED, APPROACHING, ARRIVED — for UI testing
       ======================= */
    const nowSeed = new Date();
    const vipsData = [
        {
            name: 'Abdullah Al-Falah',
            company: 'Saudi Tech',
            plate: 'BCS156',
            protocolLevel: 'B',
            session: {
                status: SessionStatus.REGISTERED,
                approachAt: null,
                arrivedAt: null,
            },
        },
        {
            name: 'Khalid Al-Mansour',
            company: 'Global Events',
            plate: 'SJM652',
            protocolLevel: 'C',
            session: {
                status: SessionStatus.APPROACHING,
                approachAt: new Date(nowSeed.getTime() - 1000 * 60 * 8),
                arrivedAt: null,
            },
        },
        {
            name: 'Mohammed Rashid',
            company: 'Dubai Investments',
            plate: 'IBU657',
            protocolLevel: 'A',
            session: {
                status: SessionStatus.ARRIVED,
                approachAt: new Date(nowSeed.getTime() - 1000 * 60 * 20),
                arrivedAt: new Date(nowSeed.getTime() - 1000 * 60 * 5),
            },
        },
    ];

    for (const data of vipsData) {
        const existingPlate = await prisma.plate.findUnique({ where: { plateNumber: data.plate } });
        if (existingPlate) {
            logger.info(`VIP plate ${data.plate} already exists, skipping.`);
            continue;
        }

        const vip = await prisma.vip.create({
            data: {
                name: data.name,
                company: data.company,
                protocolLevel: data.protocolLevel,
                notes: `Special guest for ${event.name}`,
                eventId: event.id,
                plates: {
                    create: { plateNumber: data.plate }
                },
                sessions: {
                    create: {
                        eventId: event.id,
                        status: data.session.status,
                        approachAt: data.session.approachAt ?? undefined,
                        arrivedAt: data.session.arrivedAt ?? undefined,
                    }
                }
            }
        });
        logger.info(`Created VIP: ${vip.name} (plate: ${data.plate})`);
    }

    /* =======================
       PlateEvents (Historic) — plates match seeded VIPs
       ======================= */
    const now = new Date();

    const reads = [
        // ✅ VIP Khalid (SJM652) spotted on Approach Road
        {
            plate: 'SJM652',
            cameraId: cam03.id,
            timestamp: new Date(now.getTime() - 1000 * 60 * 10),
            idempotencyKey: 'IDEM-HIST-1',
            eventId: event.id,
            confidence: 0.97
        },
        // ✅ VIP Mohammed (IBU657) spotted on Approach Road
        {
            plate: 'IBU657',
            cameraId: cam03.id,
            timestamp: new Date(now.getTime() - 1000 * 60 * 22),
            idempotencyKey: 'IDEM-HIST-2',
            eventId: event.id,
            confidence: 0.99
        },
        // ✅ VIP Mohammed (IBU657) arrived at Main Gate
        {
            plate: 'IBU657',
            cameraId: cam01.id,
            timestamp: new Date(now.getTime() - 1000 * 60 * 6),
            idempotencyKey: 'IDEM-HIST-3',
            eventId: event.id,
            confidence: 0.95
        },
        // ❌ Unknown vehicle at Side Gate
        {
            plate: 'GUEST001',
            cameraId: cam02.id,
            timestamp: new Date(now.getTime() - 1000 * 60 * 2),
            idempotencyKey: 'IDEM-HIST-4',
            eventId: event.id,
            confidence: 0.85
        },
    ];

    for (const r of reads) {
        const existingRead = await prisma.plateEvent.findUnique({ where: { idempotencyKey: r.idempotencyKey } });
        if (existingRead) {
            logger.info(`PlateEvent ${r.idempotencyKey} already exists, skipping.`);
            continue;
        }

        const plateEvt = await prisma.plateEvent.create({ data: r });

        await prisma.auditLog.create({
            data: {
                action: 'PLATE_READ_RECEIVED',
                meta: { plateEventId: plateEvt.id, eventId: event.id, plate: r.plate },
            },
        });
    }
    logger.info(`PlateEvents seeding complete (${reads.length} records processed)`);

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
