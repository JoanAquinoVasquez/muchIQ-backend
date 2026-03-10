// Lo que devuelve login y register (auto-login)
export interface AuthResponse {
    access_token: string;   // expira en 15 minutos
    refresh_token: string;  // expira en 7 días, guardado en DB
    user: AuthUserInfo;
}

// Datos del usuario que viajan al cliente (sin campos sensibles)
export interface AuthUserInfo {
    id: string;
    email: string;
    name: string | null | undefined;
    role: string;
}

// Forma del objeto que passport-jwt inyecta en req.user
export interface AuthenticatedUser {
    userId: string;
    email: string;
    role: string;
}
