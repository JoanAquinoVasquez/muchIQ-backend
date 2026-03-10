import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthenticatedUser } from '../interfaces/auth-response.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'muchiq-secret-key-2025',
        });
    }

    // Lo que devuelva este método se inyecta en req.user
    validate(payload: JwtPayload): AuthenticatedUser {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}
