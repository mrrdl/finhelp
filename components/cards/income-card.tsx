import { Card } from "@/components/ui/card"
import { BanknoteIcon } from "lucide-react"

export function IncomeCard() {
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="h-12 w-12 rounded-md bg-green-50 flex items-center justify-center">
          <BanknoteIcon className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-600">Total Income</p>
          <h3 className="text-2xl font-bold">₹ 93,000</h3>
        </div>
      </div>
    </Card>
  )
}
