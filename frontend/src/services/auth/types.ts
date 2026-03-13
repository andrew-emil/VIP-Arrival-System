import { Role } from "../users/types";

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

