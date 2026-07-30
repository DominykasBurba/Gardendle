import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthInputDTO } from "./dto/auth-input.dto";
import { UsersService } from "src/users/users.service";
import { SingInDataDTO } from "src/auth/dto/sign-in-data.dto";
import { AuthResultDTO } from  "src/auth/dto/auth-result.dto";
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from "./dto/register-input.dto";
import * as argon2 from 'argon2';


@Injectable()
export class AuthService {
    constructor (private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async authenticateUser(input: AuthInputDTO) : Promise<AuthResultDTO> {

        const user = await this.validateUser(input)

        if(!user) {
            throw new UnauthorizedException();
        }

        return this.signIn(user)
    }


    async validateUser(input: AuthInputDTO) : Promise<SingInDataDTO | null> {
        const user = await this.usersService.findUserByName(input.username)

        if(!user) {
            return null
        }
        const passwordMatches = await argon2.verify(user.password, input.password)

        if(user && passwordMatches) {
            return {
                userId: user.id,
                username: user.username
            };
        }
        
        return null
    }

    async signIn(user: SingInDataDTO): Promise<AuthResultDTO> {
        const tokenPayload = {
            sub: user.userId,
            username: user.username,
        };

        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return {accessToken, username: user.username, userId: user.userId}
    }

    async registerUser(user: RegisterDTO): Promise<AuthResultDTO>  {
        const existingUsername = await this.usersService.findUserByName(user.username)
        const existingEmail = await this.usersService.findUserByEmail(user.email)

        if(existingUsername || existingEmail){
            throw new ConflictException("Username or email already exists")
        }

        const passwordHash = await argon2.hash(user.password);

        const createdUser = await this.usersService.createUser({
            username: user.username,
            email: user.email,
            passwordHash,
        });

        return this.signIn({
            userId: createdUser.id,
            username: createdUser.username,
        });
    }
}
