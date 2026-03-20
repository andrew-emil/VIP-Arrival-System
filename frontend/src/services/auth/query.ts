
import api from "@/lib/api";
import { IUser } from "../users";

async function fetchCurrentUser() {
    try {
        const { data } = await api.get<IUser>('/auth/me')
        return data
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function getCurrentUser() {
    // 1) Quick local check (MVP: login sets sessionStorage.user)
    const raw = sessionStorage.getItem('user')
    if (raw) {
        try {
            return JSON.parse(raw) as IUser
        } catch (e) {
            sessionStorage.removeItem('user')
        }
    }

    // 2) Fallback to API (if session-based auth exists)
    const user = await fetchCurrentUser()
    if (user && "status" in user) {
        return null
    }
    sessionStorage.setItem('user', JSON.stringify(user))
    return user as IUser
}