import { redirect } from "react-router";
import { getCurrentUser } from "../services/auth";
import { Role } from "../types/auth";

export async function rootLoader() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    switch (user.role) {
        case Role.ADMIN:
            return redirect('/admin')
        case Role.MANAGER:
        case Role.OPERATOR:
            return redirect('/dashboard')
        case Role.OBSERVER:
            return redirect('/monitor')
        case Role.GATE_GUARD:
            return redirect('/gate')
        default:
            return redirect('/login')
    }
}