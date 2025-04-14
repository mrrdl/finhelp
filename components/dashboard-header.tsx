"use client"

import { Search, User2, LogIn, LogOut, Home, FileText, Users, BarChart2, Truck } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const pathname = usePathname?.() || ""
  const { userType, authStatus, userName, logout } = useUser()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <nav className="flex items-center space-x-8">
          <Link
            href="/"
            className={`text-xl font-medium flex items-center gap-2 ${isActive("/") ? "text-blue-600 font-semibold" : "text-gray-800"}`}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          {/* Show different navigation based on user type */}
          {authStatus === "authenticated" && userType === "freelancer" && (
            <>
              <Link
                href="/clients"
                className={`text-xl font-medium flex items-center gap-2 ${isActive("/clients") ? "text-blue-600 font-semibold" : "text-gray-800"}`}
              >
                <Users className="h-5 w-5" />
                <span>Clients</span>
              </Link>
              <Link
                href="/invoices"
                className={`text-xl font-medium flex items-center gap-2 ${isActive("/invoices") ? "text-blue-600 font-semibold" : "text-gray-800"}`}
              >
                <FileText className="h-5 w-5" />
                <span>Invoices</span>
              </Link>
            </>
          )}

          {authStatus === "authenticated" && userType === "gig-worker" && (
            <>
              <Link
                href="/deliveries"
                className={`text-xl font-medium flex items-center gap-2 ${isActive("/deliveries") ? "text-blue-600 font-semibold" : "text-gray-800"}`}
              >
                <Truck className="h-5 w-5" />
                <span>Deliveries</span>
              </Link>
              <Link
                href="/partner-apps"
                className={`text-xl font-medium flex items-center gap-2 ${isActive("/partner-apps") ? "text-blue-600 font-semibold" : "text-gray-800"}`}
              >
                <Users className="h-5 w-5" />
                <span>Partner Apps</span>
              </Link>
            </>
          )}

          <Link
            href="/finfit"
            className={`text-xl font-medium flex items-center gap-2 ${isActive("/finfit") ? "text-blue-600 font-semibold" : "text-gray-800"}`}
          >
            <BarChart2 className="h-5 w-5" />
            <span>FinFit Score</span>
          </Link>

          <Link
            href="/taxation"
            className={`text-xl font-medium flex items-center gap-2 ${isActive("/taxation") ? "text-blue-600 font-semibold" : "text-gray-800"}`}
          >
            <FileText className="h-5 w-5" />
            <span>Taxation</span>
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search className="h-6 w-6 text-gray-600" />
          </button>

          {authStatus === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User2 className="h-6 w-6 text-blue-600" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{userName}</span>
                    <span className="text-xs text-gray-500 capitalize">{userType?.replace("-", " ")}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span>Login / Register</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
