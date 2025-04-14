"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"

export function WelcomeBanner() {
  const { authStatus } = useUser()

  if (authStatus === "authenticated") {
    return null
  }

  return (
    <Card className="mb-8 bg-blue-50 border-blue-100">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-800">Welcome to FinHelp</CardTitle>
        <CardDescription className="text-blue-700">
          Your financial management platform for gig workers and freelancers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-blue-700 mb-4">
          Sign up or log in to access personalized financial insights, track your earnings, and improve your financial
          health.
        </p>
        <div className="flex gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            <Link href="/login?register=true">Register</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
