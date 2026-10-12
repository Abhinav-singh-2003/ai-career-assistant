export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthResponse {
    message: string;
    token: string;
     user: User;
}