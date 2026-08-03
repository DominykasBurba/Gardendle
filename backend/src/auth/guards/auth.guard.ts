import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor (private readonly jwtService : JwtService) {}

    async canActivate(context: ExecutionContext) {

        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.split(' ')[1];

        if(!token) {
            throw new UnauthorizedException();
        }

        try {
            const tokenPayload = await this.jwtService.verifyAsync(token);

            if(tokenPayload.kind !== 'access-token' || typeof tokenPayload.sub !== 'number' || typeof tokenPayload.username !== 'string') { 
                throw new UnauthorizedException();
            }
            request.user = {
                userId: tokenPayload.sub,
                username: tokenPayload.username,
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}