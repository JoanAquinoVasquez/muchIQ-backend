import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/users/user.repository';
import { User } from '../../domain/users/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject(IUserRepository)
        private userRepository: IUserRepository,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async create(data: Partial<User>): Promise<User> {
        return this.userRepository.create(data);
    }
}
