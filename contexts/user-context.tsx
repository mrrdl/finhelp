"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserType = "gig-worker" | "freelancer" | null
type AuthStatus = "authenticated" | "unauthenticated" | "loading"

interface UserContextType {
  userType: UserType
  authStatus: AuthStatus
  userName: string | null
  login: (type: UserType, name: string) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null)
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading")
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    // Check for saved auth in localStorage (in a real app, this would be a proper auth check)
    const savedUserType = localStorage.getItem("finhelp-user-type") as UserType
    const savedUserName = localStorage.getItem("finhelp-user-name")

    if (savedUserType && savedUserName) {
      setUserType(savedUserType)
      setUserName(savedUserName)
      setAuthStatus("authenticated")
    } else {
      setAuthStatus("unauthenticated")
    }
  }, [])

  const login = (type: UserType, name: string) => {
    setUserType(type)
    setUserName(name)
    setAuthStatus("authenticated")
    localStorage.setItem("finhelp-user-type", type as string)
    localStorage.setItem("finhelp-user-name", name)
  }

  const logout = () => {
    setUserType(null)
    setUserName(null)
    setAuthStatus("unauthenticated")
    localStorage.removeItem("finhelp-user-type")
    localStorage.removeItem("finhelp-user-name")
  }

  return (
    <UserContext.Provider value={{ userType, authStatus, userName, login, logout }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
