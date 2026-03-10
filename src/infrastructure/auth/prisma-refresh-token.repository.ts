import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IRefreshTokenRepository,
    CreateRefreshTokenData,
} from '../../domain/auth/refresh-token.repository';
import { RefreshToken } from '../../domain/auth/refresh-token.entity';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
        const token = await this.prisma.refreshToken.create({ data });
        return new RefreshToken(token);
    }

    async findByToken(tokenHash: string): Promise<RefreshToken | null> {
        const token = await this.prisma.refreshToken.findUnique({
            where: { token: tokenHash },
            include: {
                user: { include: { role: true } },
            },
        });
        return token ? new RefreshToken(token as unknown as RefreshToken) : null;
    }

    async revoke(tokenHash: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { token: tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
}
