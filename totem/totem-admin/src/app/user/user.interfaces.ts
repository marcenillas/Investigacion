export interface User {
    userId: string;
    fullName: string;
    email: string;
    password: string;
    enabled: boolean;
    user: boolean;
    admin: boolean;
    operator: boolean;
}