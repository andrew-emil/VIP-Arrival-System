import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        name: createEventDto.name,
        startTime: new Date(createEventDto.startTime),
        endTime: new Date(createEventDto.endTime),
        status: createEventDto.status,
        window: createEventDto.window,
      },
    });
  }

  async findActive() {
    const now = new Date();
    return this.prisma.event.findMany({
      where: {
        startTime: { lte: now },
        endTime: { gte: now },
        status: 'ACTIVE', // Assuming 'ACTIVE' status is required, or remove if only time-based
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    return this.prisma.event.update({
      where: { id: event.id },
      data: {
        ...updateEventDto,
        startTime: updateEventDto.startTime ? new Date(updateEventDto.startTime) : undefined,
        endTime: updateEventDto.endTime ? new Date(updateEventDto.endTime) : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    return this.prisma.event.delete({
      where: { id: event.id },
    });
  }
}
