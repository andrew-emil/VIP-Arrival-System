import { Injectable, Logger, MessageEvent, OnModuleInit, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import crypto from 'crypto';
import { Subject } from 'rxjs';
import { RealtimeEvent, RealtimeConfig } from './realtime.enums';

export interface SseEvent {
    data: any;
    type: string;
}

@Injectable()
export class RealtimeService implements OnModuleInit {
    private readonly logger = new Logger(RealtimeService.name);

    // Ticket ID -> expiry timestamp
    private validTickets = new Map<string, number>();

    // Client ID -> Subject
    private clients = new Map<string, Subject<MessageEvent>>();

    onModuleInit() {
        // Emit CAMERA_HEALTH every 30s as a heartbeat
        setInterval(() => {
            this.emit(RealtimeEvent.CAMERA_HEALTH, { status: 'healthy', timestamp: new Date() });
        }, RealtimeConfig.HEARTBEAT_INTERVAL_MS);
    }

    // Generates a short-lived UUID ticket
    generateTicket(): string {
        const ticket = crypto.randomUUID();
        const expiry = Date.now() + RealtimeConfig.TICKET_TTL_MS;
        this.validTickets.set(ticket, expiry);

        return ticket;
    }

    // Validates and consumes ticket, returning a new SSE stream
    createStream(ticket: string): Subject<MessageEvent> {
        this.cleanupTickets();

        if (!this.validTickets.has(ticket)) {
            throw new UnauthorizedException('Invalid or expired ticket');
        }

        if (this.clients.size >= RealtimeConfig.MAX_CONNECTIONS) {
            throw new ServiceUnavailableException('Maximum concurrent connections reached');
        }

        // Consume the ticket so it can't be reused
        this.validTickets.delete(ticket);

        const clientId = crypto.randomUUID();
        const subject = new Subject<MessageEvent>();

        this.clients.set(clientId, subject);
        this.logger.log(`Client ${clientId} connected. Total clients: ${this.clients.size}`);

        return subject;
    }

    removeClient(subject: Subject<MessageEvent>) {
        for (const [clientId, clientSubject] of this.clients.entries()) {
            if (clientSubject === subject) {
                this.clients.delete(clientId);
                this.logger.log(`Client ${clientId} disconnected. Total clients: ${this.clients.size}`);
                break;
            }
        }
    }

    emit(type: string, payload: any) {
        const messageEvent = {
            data: payload,
            type: type
        } as MessageEvent;

        const isCritical = [RealtimeEvent.ALERT_CREATED as string, RealtimeEvent.VIP_ARRIVED as string].includes(type);

        for (const [clientId, subject] of this.clients.entries()) {
            try {
                if (subject.closed) {
                    this.clients.delete(clientId);
                    continue;
                }
                subject.next(messageEvent);
            } catch (error) {
                this.logger.error(`Error emitting to client ${clientId}`, error);
                if (isCritical) {
                    this.logger.warn(`Critical event ${type} failed to deliver to ${clientId}`);
                }
            }
        }
    }

    private cleanupTickets() {
        const now = Date.now();
        for (const [ticket, expiry] of this.validTickets.entries()) {
            if (now > expiry) {
                this.validTickets.delete(ticket);
            }
        }
    }
}
