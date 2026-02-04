import { Controller, Post } from '@nestjs/common';
// import { IngressService } from './ingress.service';

@Controller('ingress')
export class IngressController {
    // constructor(private readonly ingressService: IngressService) { }

    @Post()
    handlePlateRead() {
        return "handlePlateRead not implemented"
    }
}
