import { DashboardHeader } from "@/components/dashboard-header"
import { PartnerAppsPage } from "@/components/partner-apps-page"

export default function PartnerApps() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <DashboardHeader />
          <PartnerAppsPage />
        </div>
      </div>
    </main>
  )
}
