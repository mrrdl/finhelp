import { Card } from "@/components/ui/card"

const recentPayments = [
  { id: 1, name: "Raj Mehra", time: "80 minutes ago" },
  { id: 2, name: "Invoice Relility", time: "0 minutes ago" },
]

export function RecentPayments() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
      <div className="space-y-4">
        {recentPayments.map((payment) => (
          <div key={payment.id} className="flex justify-between items-center">
            <span className="font-medium">{payment.name}</span>
            <span className="text-gray-500 text-sm">{payment.time}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
