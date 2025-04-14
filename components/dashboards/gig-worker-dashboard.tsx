"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Clock, Bike, ShoppingBag, AlertCircle } from "lucide-react"
import Link from "next/link"

// Partner app icons (simplified)
const PartnerAppIcons: Record<string, React.ReactNode> = {
  zomato: (
    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">Z</div>
  ),
  swiggy: (
    <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">S</div>
  ),
  zepto: (
    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">Z</div>
  ),
  blinkit: (
    <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">B</div>
  ),
  uber: <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white font-bold">U</div>,
  ola: <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">O</div>,
  rapido: (
    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">R</div>
  ),
  porter: (
    <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">P</div>
  ),
}

export function GigWorkerDashboard() {
  const [partnerApps, setPartnerApps] = useState<string[]>([])
  const [partnerId, setPartnerId] = useState<string>("")
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    // Get partner apps and partner ID from localStorage
    const storedApps = localStorage.getItem("finhelp-partner-apps")
    const storedId = localStorage.getItem("finhelp-partner-id")
    const storedName = localStorage.getItem("finhelp-user-name")

    if (storedApps) {
      setPartnerApps(JSON.parse(storedApps))
    }
    if (storedId) {
      setPartnerId(storedId)
    }
    if (storedName) {
      setUserName(storedName)
    }
  }, [])

  // Sample data for a gig worker - would be fetched from API in real app
  const gigWorkerData = {
    earnings: {
      today: 850,
      thisWeek: 5600,
      thisMonth: 22400,
    },
    deliveries: {
      today: 12,
      thisWeek: 78,
      thisMonth: 312,
    },
    finFitScore: 682,
    pendingPayments: 1200,
    nextPayout: "Apr 18, 2025",
    recentDeliveries: [
      { id: "DEL-12345", platform: "Zomato", amount: 120, time: "2 hours ago" },
      { id: "DEL-12344", platform: "Swiggy", amount: 85, time: "4 hours ago" },
      { id: "DEL-12343", platform: "Zepto", amount: 65, time: "Yesterday" },
      { id: "DEL-12342", platform: "Zomato", amount: 110, time: "Yesterday" },
    ],
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {partnerApps.map((app) => (
              <span key={app} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {app.charAt(0).toUpperCase() + app.slice(1)}
              </span>
            ))}
          </div>
        </div>
        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">Request Advance</Button>
      </div>

      {/* Partner App Integration Alert */}
      {partnerApps.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Partner Apps Connected</h3>
            <p className="text-blue-700 text-sm">
              We're syncing your data from {partnerApps.length} partner app{partnerApps.length > 1 ? "s" : ""}. Your
              earnings and delivery data will be updated automatically.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-green-50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Today's Earnings</p>
              <h3 className="text-2xl font-bold">₹ {gigWorkerData.earnings.today}</h3>
              <p className="text-sm text-gray-500">This Week: ₹ {gigWorkerData.earnings.thisWeek.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center">
              <Bike className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Deliveries</p>
              <h3 className="text-2xl font-bold">{gigWorkerData.deliveries.today} Today</h3>
              <p className="text-sm text-gray-500">This Week: {gigWorkerData.deliveries.thisWeek} deliveries</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-purple-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Next Payout</p>
              <h3 className="text-2xl font-bold">₹ {gigWorkerData.pendingPayments}</h3>
              <p className="text-sm text-gray-500">Expected on {gigWorkerData.nextPayout}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1 p-6">
          <h2 className="text-xl font-semibold mb-4">FinFit Score</h2>
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray="282.7"
                  strokeDashoffset={(1 - gigWorkerData.finFitScore / 1000) * 282.7}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{gigWorkerData.finFitScore}</span>
                <span className="text-sm text-gray-600 font-medium">Good</span>
              </div>
            </div>
            <Link href="/finfit" className="mt-4 text-blue-600 font-medium hover:underline flex items-center">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Earnings Breakdown by App</h2>
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="space-y-4">
                {partnerApps.includes("zomato") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["zomato"]}
                        <span className="font-medium ml-2">Zomato</span>
                      </div>
                      <span>₹ 450</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </>
                )}

                {partnerApps.includes("swiggy") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["swiggy"]}
                        <span className="font-medium ml-2">Swiggy</span>
                      </div>
                      <span>₹ 320</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </>
                )}

                {partnerApps.includes("zepto") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["zepto"]}
                        <span className="font-medium ml-2">Zepto</span>
                      </div>
                      <span>₹ 80</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </>
                )}

                {partnerApps
                  .filter((app) => !["zomato", "swiggy", "zepto"].includes(app))
                  .map((app) => (
                    <React.Fragment key={app}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {PartnerAppIcons[app]}
                          <span className="font-medium ml-2">{app.charAt(0).toUpperCase() + app.slice(1)}</span>
                        </div>
                        <span>₹ {Math.floor(Math.random() * 200) + 50}</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30) + 5} className="h-2" />
                    </React.Fragment>
                  ))}

                {partnerApps.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No partner apps connected. Please update your profile.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="space-y-4">
                {partnerApps.includes("zomato") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["zomato"]}
                        <span className="font-medium ml-2">Zomato</span>
                      </div>
                      <span>₹ 2,800</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </>
                )}

                {partnerApps.includes("swiggy") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["swiggy"]}
                        <span className="font-medium ml-2">Swiggy</span>
                      </div>
                      <span>₹ 2,100</span>
                    </div>
                    <Progress value={37.5} className="h-2" />
                  </>
                )}

                {partnerApps.includes("zepto") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["zepto"]}
                        <span className="font-medium ml-2">Zepto</span>
                      </div>
                      <span>₹ 700</span>
                    </div>
                    <Progress value={12.5} className="h-2" />
                  </>
                )}

                {partnerApps
                  .filter((app) => !["zomato", "swiggy", "zepto"].includes(app))
                  .map((app) => (
                    <React.Fragment key={app}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {PartnerAppIcons[app]}
                          <span className="font-medium ml-2">{app.charAt(0).toUpperCase() + app.slice(1)}</span>
                        </div>
                        <span>₹ {Math.floor(Math.random() * 1500) + 500}</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30) + 5} className="h-2" />
                    </React.Fragment>
                  ))}

                {partnerApps.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No partner apps connected. Please update your profile.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <div className="space-y-4">
                {partnerApps.includes("zomato") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["zomato"]}
                        <span className="font-medium ml-2">Zomato</span>
                      </div>
                      <span>₹ 10,800</span>
                    </div>
                    <Progress value={48.2} className="h-2" />
                  </>
                )}

                {partnerApps.includes("swiggy") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["swiggy"]}
                        <span className="font-medium ml-2">Swiggy</span>
                      </div>
                      <span>₹ 8,400</span>
                    </div>
                    <Progress value={37.5} className="h-2" />
                  </>
                )}

                {partnerApps.includes("zepto") && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PartnerAppIcons["zepto"]}
                        <span className="font-medium ml-2">Zepto</span>
                      </div>
                      <span>₹ 3,200</span>
                    </div>
                    <Progress value={14.3} className="h-2" />
                  </>
                )}

                {partnerApps
                  .filter((app) => !["zomato", "swiggy", "zepto"].includes(app))
                  .map((app) => (
                    <React.Fragment key={app}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {PartnerAppIcons[app]}
                          <span className="font-medium ml-2">{app.charAt(0).toUpperCase() + app.slice(1)}</span>
                        </div>
                        <span>₹ {Math.floor(Math.random() * 5000) + 2000}</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30) + 5} className="h-2" />
                    </React.Fragment>
                  ))}

                {partnerApps.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No partner apps connected. Please update your profile.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Deliveries</h2>
          <div className="space-y-4">
            {gigWorkerData.recentDeliveries
              .filter((delivery) => partnerApps.includes(delivery.platform.toLowerCase()))
              .map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{delivery.id}</div>
                    <div className="text-sm text-gray-500">
                      {delivery.platform} • {delivery.time}
                    </div>
                  </div>
                  <div className="font-medium">₹ {delivery.amount}</div>
                </div>
              ))}

            {gigWorkerData.recentDeliveries.filter((delivery) => partnerApps.includes(delivery.platform.toLowerCase()))
              .length === 0 && (
              <div className="text-center py-4 text-gray-500">No recent deliveries from your connected apps.</div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Link href="/deliveries" className="text-blue-600 font-medium hover:underline">
              View All Deliveries
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Eligible for ₹15,000 advance</h3>
                <p className="text-sm text-gray-600">Based on your consistent earnings pattern</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Earnings up 12% this week</h3>
                <p className="text-sm text-gray-600">Keep up the good work!</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Peak earning hours: 6PM - 9PM</h3>
                <p className="text-sm text-gray-600">Schedule deliveries during these hours for maximum earnings</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
