import { Module } from '@nestjs/common';
import { UsersService } from '../../application/users/users.service';
import { PrismaUserRepository } from '../../infrastructure/users/prisma-users.repository';
import { IUserRepository } from '../../domain/users/user.repository';

@Module({
    providers: [
        UsersService,
        {
            provide: IUserRepository,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [UsersService],
})
export class UsersModule { }
