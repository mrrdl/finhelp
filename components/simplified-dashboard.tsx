import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Users, BarChart2 } from "lucide-react"
import Link from "next/link"

export function SimplifiedDashboard() {
  return (
    <div className="space-y-8">
      {/* FinFit Score Preview */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">Discover Your FinFit Score</CardTitle>
          <CardDescription className="text-blue-700">
            Understand your financial health and unlock better financial opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <svg className="w-48 h-48" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray="282.7"
                  strokeDashoffset={(1 - 720 / 1000) * 282.7}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="10"
                  strokeDasharray="282.7"
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  strokeOpacity="0.2"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                <span className="text-5xl font-bold">?</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-blue-700">
                Your FinFit Score is a comprehensive measure of your financial health based on your income stability,
                payment history, and client quality.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-800 font-medium">Income Stability</span>
                  <span className="text-blue-800">35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 font-medium">Payment History</span>
                  <span className="text-blue-800">30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 font-medium">Client Quality</span>
                  <span className="text-blue-800">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 font-medium">Other Factors</span>
                  <span className="text-blue-800">10%</span>
                </div>
              </div>
              <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Link href="/login">
                  Get Your Score
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Trends</CardTitle>
          <CardDescription>Track your income and payment patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Sign up to view your payment trends</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/login?register=true">Register Now</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Apps & Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>For Gig Workers</CardTitle>
            <CardDescription>Connect your partner apps and track your earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Track earnings across multiple platforms</h3>
                  <p className="text-sm text-gray-600">Zomato, Swiggy, Uber, Ola, and more</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Optimize your working hours</h3>
                  <p className="text-sm text-gray-600">Discover peak earning times and opportunities</p>
                </div>
              </div>
              <Button asChild className="w-full mt-2">
                <Link href="/login?register=true&type=gig-worker">Register as Gig Worker</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Freelancers</CardTitle>
            <CardDescription>Manage your clients and invoices efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Client management</h3>
                  <p className="text-sm text-gray-600">Track client details and payment history</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Invoice tracking</h3>
                  <p className="text-sm text-gray-600">Create and manage professional invoices</p>
                </div>
              </div>
              <Button asChild className="w-full mt-2">
                <Link href="/login?register=true&type=freelancer">Register as Freelancer</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
