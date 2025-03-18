export enum UserRole {
    User = 1,
    Admin = 2,
    Operator = 3,
}

export enum UserStatus {
    Registered = 0,
    PendingValidation = 1,
    PendingActivation = 2,
    Active = 3,
    Inactive = 4,
}

export interface JWTPayload {
    userId: string;
}