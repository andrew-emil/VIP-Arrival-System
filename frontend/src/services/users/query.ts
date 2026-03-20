import api from "@/lib/api";
import { IUser } from "./types";

export async function getUsers() {
    try {
        const { data } = await api.get<IUser[]>("/users");
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function getUserById(id: string) {
    try {
        const { data } = await api.get<IUser>(`/users/${id}`);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}