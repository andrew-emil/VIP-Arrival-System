import api from "@/lib/api";
import { CreateUserDto, UpdateUserDto, IUser } from "./types";

export async function createUser(dto: CreateUserDto) {
    try {
        const { data } = await api.post<IUser>("/users", dto);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function updateUser(id: string, dto: UpdateUserDto) {
    try {
        const { data } = await api.patch<IUser>(`/users/${id}`, dto);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function assignPermissions(id: string, permissions: string[]) {
    try {
        const { data } = await api.post<IUser>(`/users/${id}/permissions`, {
            permissions,
        });
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function deleteUser(id: string) {
    try {
        await api.delete(`/users/${id}`);
    } catch (error) {
        throw error?.response?.data || error;
    }
}