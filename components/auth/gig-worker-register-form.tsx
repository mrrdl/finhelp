"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useUser } from "@/contexts/user-context"

const PARTNER_APPS = [
  { id: "zomato", name: "Zomato" },
  { id: "swiggy", name: "Swiggy" },
  { id: "zepto", name: "Zepto" },
  { id: "blinkit", name: "Blinkit" },
  { id: "uber", name: "Uber" },
  { id: "ola", name: "Ola" },
  { id: "rapido", name: "Rapido" },
  { id: "porter", name: "Porter" },
]

export function GigWorkerRegisterForm() {
  const router = useRouter()
  const { login } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    partnerApps: [] as string[],
  })
  const [partnerIds, setPartnerIds] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePartnerAppChange = (appId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      partnerApps: checked ? [...prev.partnerApps, appId] : prev.partnerApps.filter((id) => id !== appId),
    }))
  }

  const handlePartnerIdChange = (appId: string, value: string) => {
    setPartnerIds((prev) => ({
      ...prev,
      [appId]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register as gig worker:", formData)
    console.log("Partner IDs:", partnerIds)

    // Store partner apps and IDs in localStorage for use in dashboard
    localStorage.setItem("finhelp-partner-apps", JSON.stringify(formData.partnerApps))
    localStorage.setItem("finhelp-partner-ids", JSON.stringify(partnerIds))

    // Login the user
    login("gig-worker", formData.name)

    // Redirect to dashboard
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Partner Apps (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {PARTNER_APPS.map((app) => (
            <div key={app.id} className="flex items-center space-x-2">
              <Checkbox
                id={`app-${app.id}`}
                checked={formData.partnerApps.includes(app.id)}
                onCheckedChange={(checked) => handlePartnerAppChange(app.id, checked as boolean)}
              />
              <Label htmlFor={`app-${app.id}`} className="text-sm font-normal">
                {app.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {formData.partnerApps.length > 0 && (
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium">Partner IDs</h3>
          <p className="text-sm text-gray-500">Enter your ID for each selected partner app</p>

          <div className="space-y-3">
            {formData.partnerApps.map((appId) => {
              const app = PARTNER_APPS.find((a) => a.id === appId)
              return (
                <div key={appId} className="space-y-1">
                  <Label htmlFor={`partner-id-${appId}`}>{app?.name} Partner ID</Label>
                  <Input
                    id={`partner-id-${appId}`}
                    placeholder={`Enter your ${app?.name} partner ID`}
                    value={partnerIds[appId] || ""}
                    onChange={(e) => handlePartnerIdChange(appId, e.target.value)}
                    required
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Create Account
      </Button>
    </form>
  )
}
