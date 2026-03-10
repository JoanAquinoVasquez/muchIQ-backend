// Forma del payload que viaja dentro del JWT
export interface JwtPayload {
    sub: string;    // userId
    email: string;
    role: string;   // nombre del rol (EXPLORER, PARTNER, ADMIN)
    iat?: number;
    exp?: number;
}
