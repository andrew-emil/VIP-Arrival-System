import { ILoginResponse } from "./auth";

export interface IUser extends ILoginResponse {
    isActive: boolean;
    createdAt: Date;
}