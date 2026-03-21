import { Role } from "@/services/users";
import { redirect } from "react-router";
import { getCurrentUser } from "@/services/auth";

export async function rootLoader() {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const role = user.role

    switch (role) {
        case Role.ADMIN:
        case Role.OPERATOR:
            return redirect('/dashboard')
        case Role.MANAGER:
        case Role.OBSERVER:
            return redirect('/manager/monitor')
        case Role.GATE_GUARD:
            return redirect('/gate')
        default:
            return redirect('/login')
    }
}