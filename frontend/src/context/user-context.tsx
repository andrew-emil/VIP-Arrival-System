import { createContext, useEffect, useState } from "react"
import { getCurrentUser, logout } from "../services/auth"
import { ILoginResponse } from "../types/auth"

export type UserContextType = {
    user: ILoginResponse | null
    setUser: (user: ILoginResponse | null) => void
    handleLogout: () => Promise<void>
    loading: boolean
}

export const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<ILoginResponse | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const init = async () => {
            try {
                const me = await getCurrentUser()
                console.log(me)
                setUser(me)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    const handleLogout = async () => {
        setLoading(true)
        await logout()
        setUser(null)
        setLoading(false)
    }

    return (
        <UserContext.Provider value={{ user, setUser, handleLogout, loading }}>
            {children}
        </UserContext.Provider>
    )
}