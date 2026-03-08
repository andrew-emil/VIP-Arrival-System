import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngressService } from './ingress.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Ingress')
@Controller('ingress')
@UseGuards(ApiKeyGuard)
@Public()
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
