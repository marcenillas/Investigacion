export interface Auth {
    email: string;
    password: string;
}

export interface Session {
    userId: string;
    email: string;
    fullName: string;
    token: string;
}

export interface AuthResponse {
    userId: string;
    email: string;
    fullName: string;
    token: string;
}

export enum AuthStatus {
    notAuthenticated = 0,
    checking = -1,
    authenticated = 1,
}