import api from "@/lib/api"
import { ILoginDto, ILoginResponse } from "./types"

export async function login(dto: ILoginDto) {
    try {
        const { data } = await api.post<ILoginResponse>('/auth/login', dto)
        return data
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function logout() {
    try {
        const { data } = await api.post<{ message: string }>('/auth/logout')
        return data
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}
