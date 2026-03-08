import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    Session,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Logged in successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(
        @Body() dto: LoginDto,
        @Session() session: Record<string, any>,
    ) {
        const user = await this.authService.login(dto);
        session['userId'] = user.id;
        return { message: 'Logged in successfully', user };
    }

    @Post('logout')
    @HttpCode(200)
    @ApiOperation({ summary: 'Logout and destroy session' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return new Promise<{ message: string }>((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) return reject(err);
                res.clearCookie('sid');
                resolve({ message: 'Logged out successfully' });
            });
        });
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current session user profile' })
    @ApiResponse({ status: 200, description: 'Current user info' })
    async me(@Session() session: Record<string, any>) {
        const userId = session['userId'];
        if (!userId) throw new UnauthorizedException('Not authenticated');
        return this.authService.getProfile(userId);
    }
}
