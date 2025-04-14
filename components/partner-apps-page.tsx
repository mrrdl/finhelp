"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle, Edit, Trash, Plus, ExternalLink } from "lucide-react"

// Partner app details
const PARTNER_APPS = [
  {
    id: "zomato",
    name: "Zomato",
    color: "#E23744",
    logo: "Z",
    description: "Food delivery platform",
    website: "https://www.zomato.com/partner",
  },
  {
    id: "swiggy",
    name: "Swiggy",
    color: "#FC8019",
    logo: "S",
    description: "Food and grocery delivery platform",
    website: "https://www.swiggy.com/delivery-partner",
  },
  {
    id: "zepto",
    name: "Zepto",
    color: "#7D3C98",
    logo: "Z",
    description: "Quick commerce platform",
    website: "https://www.zeptonow.com/delivery-partner",
  },
  {
    id: "blinkit",
    name: "Blinkit",
    color: "#F9E076",
    logo: "B",
    description: "Grocery delivery platform",
    website: "https://blinkit.com/careers/delivery-partner",
  },
  {
    id: "uber",
    name: "Uber",
    color: "#000000",
    logo: "U",
    description: "Ride-sharing and food delivery platform",
    website: "https://www.uber.com/in/en/drive/",
  },
  {
    id: "ola",
    name: "Ola",
    color: "#4CAF50",
    logo: "O",
    description: "Ride-sharing platform",
    website: "https://partners.olacabs.com/",
  },
  {
    id: "rapido",
    name: "Rapido",
    color: "#2196F3",
    logo: "R",
    description: "Bike taxi platform",
    website: "https://www.rapido.bike/careers",
  },
  {
    id: "porter",
    name: "Porter",
    color: "#9E9E9E",
    logo: "P",
    description: "Logistics and packers & movers platform",
    website: "https://porter.in/driver-partner",
  },
]

export function PartnerAppsPage() {
  const [connectedApps, setConnectedApps] = useState<string[]>([])
  const [partnerIds, setPartnerIds] = useState<Record<string, string>>({})
  const [editingApp, setEditingApp] = useState<string | null>(null)
  const [newPartnerId, setNewPartnerId] = useState<string>("")
  const [newApps, setNewApps] = useState<string[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    // Get partner apps and IDs from localStorage
    const storedApps = localStorage.getItem("finhelp-partner-apps")
    const storedIds = localStorage.getItem("finhelp-partner-ids")

    if (storedApps) {
      setConnectedApps(JSON.parse(storedApps))
    }

    if (storedIds) {
      setPartnerIds(JSON.parse(storedIds))
    }
  }, [])

  const handleSavePartnerId = () => {
    if (editingApp && newPartnerId) {
      const updatedIds = { ...partnerIds, [editingApp]: newPartnerId }
      setPartnerIds(updatedIds)
      localStorage.setItem("finhelp-partner-ids", JSON.stringify(updatedIds))
      setEditingApp(null)
      setNewPartnerId("")
    }
  }

  const handleRemoveApp = (appId: string) => {
    const updatedApps = connectedApps.filter((id) => id !== appId)
    setConnectedApps(updatedApps)
    localStorage.setItem("finhelp-partner-apps", JSON.stringify(updatedApps))

    // Also remove the partner ID
    const updatedIds = { ...partnerIds }
    delete updatedIds[appId]
    setPartnerIds(updatedIds)
    localStorage.setItem("finhelp-partner-ids", JSON.stringify(updatedIds))
  }

  const handleAddNewApps = () => {
    if (newApps.length > 0) {
      const updatedApps = [...connectedApps, ...newApps]
      setConnectedApps(updatedApps)
      localStorage.setItem("finhelp-partner-apps", JSON.stringify(updatedApps))
      setNewApps([])
      setIsAddingNew(false)
    }
  }

  const handleNewAppChange = (appId: string, checked: boolean) => {
    if (checked) {
      setNewApps([...newApps, appId])
    } else {
      setNewApps(newApps.filter((id) => id !== appId))
    }
  }

  // Generate some sample statistics for connected apps
  const getAppStatistics = (appId: string) => {
    // Random data for demonstration
    return {
      deliveries: Math.floor(Math.random() * 50) + 10,
      earnings: Math.floor(Math.random() * 5000) + 1000,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      status: Math.random() > 0.8 ? "issue" : "active",
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Partner Apps</h1>
          <p className="text-gray-500 mt-1">Manage your connected delivery platforms</p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          Connect New App
        </Button>
      </div>

      {isAddingNew && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect New Partner Apps</CardTitle>
            <CardDescription>Select the apps you want to connect to your FinHelp account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PARTNER_APPS.filter((app) => !connectedApps.includes(app.id)).map((app) => (
                <div key={app.id} className="flex items-start space-x-2 p-4 border rounded-lg">
                  <Checkbox
                    id={`new-app-${app.id}`}
                    checked={newApps.includes(app.id)}
                    onCheckedChange={(checked) => handleNewAppChange(app.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`new-app-${app.id}`} className="flex items-center cursor-pointer">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold mr-2"
                        style={{ backgroundColor: app.color }}
                      >
                        {app.logo}
                      </div>
                      <div>
                        <div className="font-medium">{app.name}</div>
                        <div className="text-sm text-gray-500">{app.description}</div>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingNew(false)
                setNewApps([])
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNewApps} disabled={newApps.length === 0}>
              Connect Selected Apps
            </Button>
          </CardFooter>
        </Card>
      )}

      {connectedApps.length === 0 && !isAddingNew ? (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>No Partner Apps Connected</CardTitle>
            <CardDescription>
              Connect your delivery partner apps to track your earnings and improve your FinFit score
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="rounded-full bg-gray-200 p-6 mb-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-center text-gray-500 mb-6">
              You haven't connected any partner apps yet. Connect your apps to get personalized insights and track your
              earnings across platforms.
            </p>
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Partner Apps
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {connectedApps.map((appId) => {
            const app = PARTNER_APPS.find((a) => a.id === appId)
            const stats = getAppStatistics(appId)

            if (!app) return null

            return (
              <Card key={appId}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                        style={{ backgroundColor: app.color }}
                      >
                        {app.logo}
                      </div>
                      <div>
                        <CardTitle>{app.name}</CardTitle>
                        <CardDescription>{app.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingApp(appId)
                          setNewPartnerId(partnerIds[appId] || "")
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveApp(appId)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingApp === appId ? (
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`partner-id-${appId}`}>Partner ID</Label>
                        <div className="flex space-x-2">
                          <Input
                            id={`partner-id-${appId}`}
                            value={newPartnerId}
                            onChange={(e) => setNewPartnerId(e.target.value)}
                            placeholder={`Enter your ${app.name} partner ID`}
                          />
                          <Button onClick={handleSavePartnerId}>Save</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Partner ID</span>
                          <span className="font-medium">{partnerIds[appId] ? partnerIds[appId] : "Not set"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Status</span>
                          <div className="flex items-center">
                            {stats.status === "active" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-600">Active</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                                <span className="text-amber-600">Needs Attention</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Recent Deliveries</span>
                          <span className="font-medium">{stats.deliveries}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Recent Earnings</span>
                          <span className="font-medium">₹ {stats.earnings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Rating</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{stats.rating}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`h-4 w-4 ${
                                    Number.parseFloat(stats.rating) >= star
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300 fill-gray-300"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={app.website} target="_blank" rel="noopener noreferrer">
                      Visit Partner Portal
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
