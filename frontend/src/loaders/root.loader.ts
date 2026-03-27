import { LoaderFunctionArgs, redirect } from "react-router";
import { getCurrentUser } from "@/services/auth";
import { Role } from "@/services/users";

export async function rootLoader({ request }: LoaderFunctionArgs) {
    const user = await getCurrentUser()
    const url = new URL(request.url);

    if (!user) {
        // If we are not on any login-related path, redirect to login
        if (url.pathname !== '/login') {
            return redirect("/login")
        }
        return null;
    }

    // Only redirect if the user explicitly visited the root path "/"
    if (url.pathname === '/') {
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

    return user;
}