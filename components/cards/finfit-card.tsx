import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FinFitCard() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-2">FinFit Score</h2>
      <div className="flex items-baseline space-x-2 mb-4">
        <span className="text-5xl font-bold">752</span>
        <span className="text-lg text-green-600 font-medium">(Good)</span>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Income Activity:</span>
          <span className="font-medium">High</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Invoice Reliability:</span>
          <span className="font-medium">On-time</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Consistency:</span>
          <span className="font-medium">8.6/10</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Active Clients:</span>
          <span className="font-medium">6</span>
        </div>
      </div>

      <Link href="/finfit" className="flex items-center text-blue-600 font-medium hover:underline">
        View Detailed Breakdown
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </Card>
  )
}
