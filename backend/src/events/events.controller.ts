import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Events')
@Controller('events')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @Roles(Role.MANAGER, Role.OPERATOR)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @Roles(Role.MANAGER, Role.OPERATOR, Role.OBSERVER)
  @ApiOperation({ summary: 'List all events' })
  @ApiResponse({ status: 200, description: 'List of all events' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('active')
  @Roles(Role.MANAGER, Role.OPERATOR, Role.OBSERVER, Role.GATE_GUARD)
  @ApiOperation({ summary: 'List currently active events' })
  @ApiResponse({ status: 200, description: 'List of active events' })
  findActive() {
    return this.eventsService.findActive();
  }

  @Get(':id')
  @Roles(Role.MANAGER, Role.OPERATOR, Role.OBSERVER)
  @ApiOperation({ summary: 'Get a single event by ID' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ status: 200, description: 'Event found' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ status: 204, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
