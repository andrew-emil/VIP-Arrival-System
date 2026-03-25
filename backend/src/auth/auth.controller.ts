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
import { Public } from './decorators/public.decorator';
import { DeviceLoginDto } from './dto/device-login.dto';
import { LoginDto } from './dto/login.dto';

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
        delete session['deviceAccountId'];
        session['userId'] = user.id;
        await new Promise<void>((resolve, reject) =>
            session.save((err) => (err ? reject(err) : resolve())),
        );

        return { user };
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

    @Public()
    @Post('device/login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Login for gate devices (tablets/phones)' })
    @ApiBody({ type: DeviceLoginDto })
    @ApiResponse({ status: 200, description: 'Login successful, returns device and camera identifiers' })
    @ApiResponse({ status: 401, description: 'Invalid device ID or password' })
    async deviceLogin(
        @Body() loginDto: DeviceLoginDto,
        @Session() session: Record<string, any>,
    ) {
        const result = await this.authService.deviceLogin(loginDto.deviceId, loginDto.password);
        delete session['userId'];
        session['deviceAccountId'] = result.deviceAccountId;
        await new Promise<void>((resolve, reject) =>
            session.save((err) => (err ? reject(err) : resolve())),
        );

        return result;
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current session user profile' })
    @ApiResponse({ status: 200, description: 'Current user info' })
    @ApiResponse({ status: 401, description: 'Authorization required' })
    async me(@Session() session: Record<string, any>) {
        const userId = session['userId'];
        if (!userId) throw new UnauthorizedException('Not authenticated');
        return this.authService.getProfile(userId);
    }
}
