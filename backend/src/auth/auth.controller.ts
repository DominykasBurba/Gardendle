import { Body, Controller, HttpStatus, Post, HttpCode, NotImplementedException, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInputDTO } from './dto/auth-input.dto'
import { AuthGuard } from './guards/auth.guard';
import { RegisterDTO } from './dto/register-input.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDTO) {
        return this.authService.registerUser(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(ThrottlerGuard)
    @Post('login')
    login(@Body() loginDto: AuthInputDTO) {
        return this.authService.authenticateUser(loginDto);
    }


    @UseGuards(AuthGuard)
    @Get('me')
    getUserInfo(@Request() request) {
        return request.user;
    }
}
