export class RefreshToken {
    id: string;
    token: string;          // guardado como hash SHA-256, nunca el token plano
    userId: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;

    // Poblado cuando se hace include: { user: { include: { role: true } } }
    user?: {
        email: string;
        role: { name: string } | null;
    };

    constructor(partial: Partial<RefreshToken>) {
        Object.assign(this, partial);
    }
}
