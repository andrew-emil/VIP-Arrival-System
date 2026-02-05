import { Controller, Post, Body, Req } from '@nestjs/common';
import { IngressService } from './ingress.service';

@Controller('ingress')
export class IngressController {
    constructor(private readonly ingressService: IngressService) { }

    @Post("plate-reads")
    handlePlateRead(@Body() body: any, @Req() req: any) {
        return this.ingressService.handlePlateRead(body, req);
    }
}
