// Lo que devuelve el endpoint de login/register
export interface AuthResponse {
    access_token: string;
    user: AuthUserInfo;
}

// Datos del usuario que viajan al cliente (sin password)
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
