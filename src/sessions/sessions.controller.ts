import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SessionsService } from './sessions.service';

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(RolesGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Get()
  @Roles(Role.MANAGER, Role.ADMIN, Role.OPERATOR, Role.OBSERVER)
  @ApiOperation({ summary: 'List all VIP sessions' })
  @ApiResponse({ status: 200, description: 'List of all sessions' })
  getAllSessions() {
    return this.sessionsService.getAllSessions();
  }

  @Get('/arrived')
  @Roles(Role.MANAGER, Role.ADMIN, Role.OPERATOR, Role.OBSERVER, Role.GATE_GUARD)
  @ApiOperation({ summary: 'List sessions with status ARRIVED or APPROACHING' })
  @ApiResponse({ status: 200, description: 'List of arrived/approaching sessions' })
  getArrivedSessions() {
    return this.sessionsService.getArrivedSessions();
  }

  @Get('/:id')
  @Roles(Role.MANAGER, Role.ADMIN, Role.OPERATOR, Role.OBSERVER)
  @ApiOperation({ summary: 'Get a single VIP session by ID' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'Session details' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSessionById(@Param('id') id: string) {
    return this.sessionsService.getSessionById(id);
  }

  @Patch('/:id/confirm')
  @Roles(Role.MANAGER, Role.ADMIN, Role.GATE_GUARD, Role.OPERATOR)
  @ApiOperation({ summary: 'Confirm a VIP session manually' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'The VIP session has been successfully confirmed.' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 409, description: 'Session already completed or confirmed' })
  confirmSession(@Param('id') id: string, @Req() req: any) {
    return this.sessionsService.confirmSession(id, req.user.id);
  }

  @Patch('/:id/complete')
  @Roles(Role.MANAGER, Role.ADMIN)
  @ApiOperation({ summary: 'Complete a VIP session manually' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'The VIP session has been successfully completed.' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 409, description: 'Session already completed' })
  completeSession(@Param('id') id: string, @Req() req: any) {
    return this.sessionsService.completeSession(id, req.user.id);
  }
}
