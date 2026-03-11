import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CameraService } from './camera.service';

@ApiTags('Camera')
@Controller('camera')
@UseGuards(RolesGuard)
export class CameraController {
    constructor(
        private readonly cameraService: CameraService
    ) { }

    @Get('health')
    @Roles(Role.MANAGER, Role.OPERATOR, Role.OBSERVER)
    @ApiOperation({ summary: 'Get cameras health status' })
    async health() {
        return this.cameraService.getCameraHealth()
    }
}
