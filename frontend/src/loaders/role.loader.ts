import { getCurrentUser } from "../services/auth";
import { redirect } from "react-router";

export function requireRole(allowed = []) {
    return async () => {
        const user = await getCurrentUser()
        if (!user) return redirect('/login')
        if (!allowed.includes(user.role)) {
            // redirect to role landing page or show 403
            return redirect('/') // rootLoader will forward to their dashboard
        }
        return user
    }
}