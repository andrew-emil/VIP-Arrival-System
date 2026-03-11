import { Controller, MessageEvent, Post, Query, Req, Res, Sse, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RealtimeService } from './realtime.service';

@ApiTags('Realtime')
@Controller('realtime')
export class RealtimeController {
    constructor(private readonly realtimeService: RealtimeService) { }

    @Post('ticket')
    @UseGuards(RolesGuard)
    @Roles(Role.MANAGER, Role.OPERATOR, Role.OBSERVER, Role.GATE_GUARD)
    @ApiOperation({ summary: 'Generate a short-lived ticket for SSE connection' })
    @ApiResponse({ status: 201, description: 'Ticket generated' })
    generateTicket() {
        return { ticket: this.realtimeService.generateTicket() };
    }

    @Sse('stream')
    @Public()
    @ApiOperation({ summary: 'Connect to real-time events stream using a valid ticket' })
    @ApiQuery({ name: 'ticket', required: true, description: 'Short-lived ticket' })
    @ApiResponse({ status: 200, description: 'SSE established' })
    stream(@Query('ticket') ticket: string, @Req() req: Request, @Res() res: Response): Observable<MessageEvent> {
        // Increase the timeout to prevent premature disconnection
        req.on('close', () => res.end());

        const subject = this.realtimeService.createStream(ticket);
        return subject.asObservable().pipe(
            finalize(() => {
                this.realtimeService.removeClient(subject);
            })
        );
    }
}
