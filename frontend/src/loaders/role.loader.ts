import { getCurrentUser } from "../services/auth";
import { redirect } from "react-router";

export function requireRole(allowed: string[] = []) {
    return async () => {
        const user = await getCurrentUser()
        if (!user) return redirect('/login')

        const userRole = user.role.toLowerCase();
        const allowedLower = allowed.map(r => r.toLowerCase());

        if (!allowedLower.includes(userRole)) {
            // redirect to role landing page or show 403
            return redirect('/') // rootLoader will forward to their dashboard
        }
        return user
    }
}