import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './guards/auth.guard';

import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/configs/jwt-secret';

@Module({
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: '1h'},
        }),
    ],
})

export class AuthModule {}