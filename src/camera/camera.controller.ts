import { Controller, Get, UseGuards } from '@nestjs/common';
import { CameraService } from './camera.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('camera')
@UseGuards(RolesGuard)
export class CameraController {
    constructor(
        private readonly cameraService: CameraService
    ) { }

    @Get('health')
    @Roles(Role.MANAGER, Role.OPERATOR, Role.OBSERVER)
    async health() {
        return this.cameraService.getCameraHealth()
    }
}
