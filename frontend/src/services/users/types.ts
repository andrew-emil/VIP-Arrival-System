import { ILoginResponse } from "../auth";

export enum Role {
    ADMIN = "ADMIN",
    OPERATOR = "OPERATOR",
    MANAGER = "MANAGER",
    OBSERVER = "OBSERVER",
    GATE_GUARD = "GATE_GUARD"
}

export interface IUser extends ILoginResponse {
    isActive: boolean;
    createdAt: Date;
}

export interface IPermission {
    id: string;
    createdAt: Date;
    permission: string;
    grantedBy: string;
    eventId: string | null;
}

export interface IUserWithPermissions extends IUser {
    permissions: IPermission[];
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: Role;
    permissions?: string[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
    isActive?: boolean;
}