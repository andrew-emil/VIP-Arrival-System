import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CameraService } from './camera.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';

@ApiTags('Camera')
@Controller('camera')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.OPERATOR)
export class CameraController {
    constructor(
        private readonly cameraService: CameraService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new camera' })
    @ApiBody({ type: CreateCameraDto })
    @ApiResponse({ status: 201, description: 'Camera created successfully' })
    create(@Body() dto: CreateCameraDto) {
        return this.cameraService.createCamera(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all cameras' })
    @ApiResponse({ status: 200, description: 'List of cameras' })
    findAll() {
        return this.cameraService.findAllCameras();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a camera by ID' })
    @ApiParam({ name: 'id', description: 'Camera UUID' })
    @ApiResponse({ status: 200, description: 'Camera details' })
    @ApiResponse({ status: 404, description: 'Camera not found' })
    findOne(@Param('id') id: string) {
        return this.cameraService.findOneCamera(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a camera' })
    @ApiParam({ name: 'id', description: 'Camera UUID' })
    @ApiBody({ type: UpdateCameraDto })
    @ApiResponse({ status: 200, description: 'Camera updated successfully' })
    @ApiResponse({ status: 404, description: 'Camera not found' })
    update(@Param('id') id: string, @Body() dto: UpdateCameraDto) {
        return this.cameraService.updateCamera(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a camera' })
    @ApiParam({ name: 'id', description: 'Camera UUID' })
    @ApiResponse({ status: 200, description: 'Camera deleted successfully' })
    @ApiResponse({ status: 404, description: 'Camera not found' })
    remove(@Param('id') id: string) {
        return this.cameraService.deleteCamera(id);
    }

    @Get('health')
    @ApiOperation({ summary: 'Get cameras health status' })
    async health() {
        return this.cameraService.getCameraHealth()
    }
}
