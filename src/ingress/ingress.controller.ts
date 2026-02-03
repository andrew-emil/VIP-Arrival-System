import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/api-key.guard';
import { IngressService } from './ingress.service';

@Controller('ingress')
export class IngressController {
    constructor(private readonly ingressService: IngressService) { }

    @UseGuards(ApiKeyGuard)
    @Post()
    handlePlateRead() {
        return "handlePlateRead not implemented"
    }
}
