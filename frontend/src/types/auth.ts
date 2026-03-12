export interface ILoginDto {
    email: string;
    password: string;
}

export interface ILoginResponse {
    id: string;
    name: string;
    email: string;
    role: Role
}

export enum Role {
    ADMIN = "ADMIN",
    OPERATOR = "OPERATOR",
    MANAGER = "MANAGER",
    OBSERVER = "OBSERVER",
    GATE_GUARD = "GATE_GUARD"
}