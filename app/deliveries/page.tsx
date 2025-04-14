import { DashboardHeader } from "@/components/dashboard-header"
import { DeliveriesPage } from "@/components/deliveries-page"

export default function Deliveries() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <DashboardHeader />
          <DeliveriesPage />
        </div>
      </div>
    </main>
  )
}
