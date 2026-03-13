import api from "@/lib/api"
import { IUser } from "./types"

async function fetchCurrentUser() {
    try {
        const { data } = await api.get<IUser>('/auth/me')
        return data
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function getCurrentUser() {
    // 1) Quick local check (MVP: login sets localStorage.user)
    const raw = localStorage.getItem('user')
    if (raw) {
        try {
            return JSON.parse(raw) as IUser
        } catch (e) {
            localStorage.removeItem('user')
        }
    }

    // 2) Fallback to API (if session-based auth exists)
    const user = await fetchCurrentUser()
    if (user && "status" in user) {
        return null
    }
    localStorage.setItem('user', JSON.stringify(user))
    return user as IUser
}