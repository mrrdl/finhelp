import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"

export function ClientsCard() {
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center">
          <Users className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-600">Active Clients</p>
          <h3 className="text-2xl font-bold">5</h3>
        </div>
      </div>
    </Card>
  )
}
