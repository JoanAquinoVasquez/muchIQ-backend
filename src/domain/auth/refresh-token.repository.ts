import { RefreshToken } from './refresh-token.entity';

export interface CreateRefreshTokenData {
    token: string;      // hash SHA-256
    userId: string;
    expiresAt: Date;
}

export interface IRefreshTokenRepository {
    create(data: CreateRefreshTokenData): Promise<RefreshToken>;
    // Devuelve el token con el usuario incluido (necesario para regenerar el JWT)
    findByToken(tokenHash: string): Promise<RefreshToken | null>;
    revoke(tokenHash: string): Promise<void>;
    revokeAllForUser(userId: string): Promise<void>;
}

export const IRefreshTokenRepository = Symbol('IRefreshTokenRepository');
