import api from "@/lib/api"
import { IDeviceLoginDto, IDeviceLoginResponse, ILoginDto, ILoginResponse } from "./types"

export async function login(dto: ILoginDto) {
    try {
        const { data } = await api.post<{ user: ILoginResponse }>('/auth/login', dto)
        return data.user
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function logout() {
    try {
        const { data } = await api.post<{ message: string }>('/auth/logout')
        return data
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function deviceLogin(dto: IDeviceLoginDto) {
    try {
        const { data } = await api.post<IDeviceLoginResponse>('/auth/device/login', dto)
        return data
    } catch (error) {
        throw error?.response?.data || error;
    }
}