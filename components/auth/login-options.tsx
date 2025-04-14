"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GigWorkerLoginForm } from "./gig-worker-login-form"
import { FreelancerLoginForm } from "./freelancer-login-form"
import { GigWorkerRegisterForm } from "./gig-worker-register-form"
import { FreelancerRegisterForm } from "./freelancer-register-form"

export function LoginOptions() {
  const searchParams = useSearchParams()
  const [authType, setAuthType] = useState<"login" | "register">("login")
  const [userType, setUserType] = useState<"gig-worker" | "freelancer">("gig-worker")

  useEffect(() => {
    // Check if register parameter is present in URL
    if (searchParams?.get("register") === "true") {
      setAuthType("register")
    }

    // Check if type parameter is present in URL
    const type = searchParams?.get("type")
    if (type === "gig-worker" || type === "freelancer") {
      setUserType(type)
    }
  }, [searchParams])

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="w-12 h-12 mb-2 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold">F</span>
        </div>
        <CardTitle className="text-2xl text-center">FinHelp</CardTitle>
        <CardDescription className="text-center">
          {authType === "login" ? "Login to your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${authType === "login" ? "bg-white shadow-sm" : ""}`}
              onClick={() => setAuthType("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                authType === "register" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setAuthType("register")}
            >
              Register
            </button>
          </div>
        </div>

        <Tabs defaultValue={userType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="gig-worker">Gig Worker</TabsTrigger>
            <TabsTrigger value="freelancer">Freelancer</TabsTrigger>
          </TabsList>

          <TabsContent value="gig-worker">
            {authType === "login" ? <GigWorkerLoginForm /> : <GigWorkerRegisterForm />}
          </TabsContent>

          <TabsContent value="freelancer">
            {authType === "login" ? <FreelancerLoginForm /> : <FreelancerRegisterForm />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
