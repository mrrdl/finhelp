"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, ArrowUpDown } from "lucide-react"

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

// Sample delivery data
const generateDeliveries = (apps: string[]) => {
  const deliveries = []
  const platforms = apps.length > 0 ? apps : ["zomato", "swiggy", "zepto"]
  const statuses = ["Completed", "Completed", "Completed", "Completed", "Cancelled"]
  const areas = ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield", "Electronic City", "JP Nagar"]

  // Generate 50 random deliveries
  for (let i = 1; i <= 50; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    deliveries.push({
      id: `DEL-${10000 + i}`,
      platform,
      date: date.toLocaleDateString(),
      time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")} ${Math.random() > 0.5 ? "PM" : "AM"}`,
      amount: Math.floor(Math.random() * 150) + 50,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      area: areas[Math.floor(Math.random() * areas.length)],
      distance: (Math.random() * 5 + 1).toFixed(1),
    })
  }

  // Sort by date (newest first)
  return deliveries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function DeliveriesPage() {
  const [partnerApps, setPartnerApps] = useState<string[]>([])
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [filteredDeliveries, setFilteredDeliveries] = useState<any[]>([])
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // Get partner apps from localStorage
    const storedApps = localStorage.getItem("finhelp-partner-apps")
    if (storedApps) {
      const apps = JSON.parse(storedApps)
      setPartnerApps(apps)
      setDeliveries(generateDeliveries(apps))
    } else {
      setDeliveries(generateDeliveries([]))
    }
  }, [])

  useEffect(() => {
    // Apply filters and search
    let filtered = [...deliveries]

    if (filterPlatform !== "all") {
      filtered = filtered.filter((delivery) => delivery.platform === filterPlatform)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((delivery) => delivery.status === filterStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (delivery) => delivery.id.toLowerCase().includes(query) || delivery.area.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      if (sortBy === "date") {
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount
      } else if (sortBy === "distance") {
        comparison = Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredDeliveries(filtered)
  }, [deliveries, filterPlatform, filterStatus, searchQuery, sortBy, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  // Calculate statistics
  const totalEarnings = filteredDeliveries.reduce((sum, delivery) => sum + delivery.amount, 0)
  const totalDeliveries = filteredDeliveries.length
  const completedDeliveries = filteredDeliveries.filter((d) => d.status === "Completed").length
  const averageAmount = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Deliveries</h1>
          <p className="text-gray-500 mt-1">Track and manage your delivery history</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDeliveries > 0 ? Math.round((completedDeliveries / totalDeliveries) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {averageAmount.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search by ID or area"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {partnerApps.map((app) => (
                    <SelectItem key={app} value={app}>
                      {app.charAt(0).toUpperCase() + app.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="flex-1">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.slice(0, 20).map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {PartnerAppIcons[delivery.platform]}
                      <span>{delivery.platform.charAt(0).toUpperCase() + delivery.platform.slice(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{delivery.date}</span>
                      <span className="text-gray-500 text-sm">{delivery.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>{delivery.area}</TableCell>
                  <TableCell>{delivery.distance} km</TableCell>
                  <TableCell className="font-medium">₹ {delivery.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        delivery.status === "Completed"
                          ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-50"
                          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-50"
                      }
                    >
                      {delivery.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDeliveries.length === 0 && (
            <div className="text-center py-8 text-gray-500">No deliveries found matching your filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
