import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';
import pg from 'pg';

const PgStore = ConnectPgSimple(session);

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const sessionMiddleware = session({
    store: new PgStore({
        pool,
        tableName: 'session',
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    name: 'sid',
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
        sameSite: 'none',
    },
});

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        sessionMiddleware(req, res, next);
    }
}
