import { Controller, Post, Body } from '@nestjs/common';
import { IngressService } from './ingress.service';

@Controller('ingress')
export class IngressController {
    constructor(private readonly ingressService: IngressService) { }

    @Post("plate-reads")
    handlePlateRead(@Body() body: any) {
        return this.ingressService.handlePlateRead(body);
    }
}
