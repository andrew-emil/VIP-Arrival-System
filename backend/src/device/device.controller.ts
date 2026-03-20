import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Devices')
@Controller('devices')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) { }

  @Post()
  @ApiOperation({ summary: "Create a new device account" })
  @ApiBody({ type: CreateDeviceDto })
  @ApiResponse({ status: 201, description: "Device account created successfully" })
  create(@Body() dto: CreateDeviceDto) {
    return this.deviceService.createDevice(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all device accounts" })
  @ApiResponse({ status: 200, description: "List of device accounts" })
  findAll() {
    return this.deviceService.findAllDevices();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a device account by ID" })
  @ApiParam({ name: "id", description: "Device account UUID" })
  @ApiResponse({ status: 200, description: "Device account details" })
  @ApiResponse({ status: 404, description: "Device not found" })
  findOne(@Param("id") id: string) {
    return this.deviceService.findOneDevice(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a device account" })
  @ApiParam({ name: "id", description: "Device account UUID" })
  @ApiBody({ type: UpdateDeviceDto })
  @ApiResponse({ status: 200, description: "Device account updated successfully" })
  update(@Param("id") id: string, @Body() dto: UpdateDeviceDto) {
    return this.deviceService.updateDevice(id, dto);
  }

  @Patch(":id/deactivate")
  @ApiOperation({ summary: "Deactivate a device account" })
  @ApiParam({ name: "id", description: "Device account UUID" })
  @ApiResponse({ status: 200, description: "Device account deactivated successfully" })
  deactivate(@Param("id") id: string) {
    return this.deviceService.deactivateDevice(id);
  }

  @Patch(":id/regenerate-password")
  @ApiOperation({ summary: "Regenerate device temporary password" })
  @ApiParam({ name: "id", description: "Device account UUID" })
  @ApiResponse({ status: 200, description: "Password regenerated successfully" })
  regeneratePassword(@Param("id") id: string) {
    return this.deviceService.regenerateDevicePassword(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a device account" })
  @ApiParam({ name: "id", description: "Device account UUID" })
  @ApiResponse({ status: 200, description: "Device account deleted successfully" })
  @ApiResponse({ status: 404, description: "Device not found" })
  remove(@Param("id") id: string) {
    return this.deviceService.deleteDevice(id);
  }
}
