import { DashboardHeader } from "@/components/dashboard-header"
import { ClientManagement } from "@/components/client-management"

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <DashboardHeader />
          <ClientManagement />
        </div>
      </div>
    </main>
  )
}
