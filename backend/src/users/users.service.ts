import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
    constructor(private readonly prisma:PrismaService) {}

    async getUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
            }
        })
    }

    async createUser(user: CreateUserDTO) {
        return this.prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.passwordHash,
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });
    }
    async findUserByName(userName : string) {
        return this.prisma.user.findUnique({
            where: {
                username: userName,
            },
            select: {
                id: true,
                username: true,
                password: true,
            },
        });
    }

    async findUserByEmail(userEmail: string) {
        return this.prisma.user.findUnique({
            where: {
                email: userEmail,
            },
            select: {
                id: true,
                email: true,
            },
        });
    }
}
