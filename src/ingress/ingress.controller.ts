import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IngressService } from './ingress.service';

@ApiTags('Ingress')
@ApiSecurity('api-key')
@Controller('ingress')
export class IngressController {
    constructor(private readonly ingressService: IngressService) { }

    @Post("plate-reads")
    @ApiOperation({ summary: 'Handle ALPR plate read events' })
    @ApiBody({ type: Object, description: 'Plate read data (can also accept webhook-specific formats)' })
    @ApiResponse({ status: 201, description: 'Plate read processed successfully' })
    handlePlateRead(@Body() body: any, @Req() req: any) {
        return this.ingressService.handlePlateRead(body, req);
    }
}
