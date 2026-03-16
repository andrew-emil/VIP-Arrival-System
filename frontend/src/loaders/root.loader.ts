import { Role } from "@/services/users";
import { redirect } from "react-router";
import { getCurrentUser } from "@/services/auth";

export async function rootLoader() {
    const user = await getCurrentUser()
    console.log(user)
    if (!user) return redirect("/login")

    const role = user.role

    switch (role) {
        case Role.ADMIN:
            return redirect('/admin/dashboard')
        case Role.MANAGER:
            return redirect('/manager/monitor')
        case Role.OPERATOR:
            return redirect('/operator/dashboard')
        case Role.GATE_GUARD:
            return redirect('/gate')
        default:
            return redirect('/login')
    }
}