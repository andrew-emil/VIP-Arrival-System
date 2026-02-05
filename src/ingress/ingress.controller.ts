import { Controller, Post, Body, Req } from '@nestjs/common';
import { IngressService } from './ingress.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { PlateReadDto } from './dto/plateRead.dto';

@ApiTags('Ingress')
@ApiSecurity('api-key')
@Controller('ingress')
export class IngressController {
    constructor(private readonly ingressService: IngressService) { }

    @Post("plate-reads")
    @ApiOperation({ summary: 'Handle ALPR plate read events' })
    @ApiBody({ type: PlateReadDto, description: 'Plate read data (can also accept webhook-specific formats)' })
    @ApiResponse({ status: 201, description: 'Plate read processed successfully' })
    handlePlateRead(@Body() body: any, @Req() req: any) {
        return this.ingressService.handlePlateRead(body, req);
    }
}
