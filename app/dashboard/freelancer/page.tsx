import { FreelancerDashboard } from "@/components/dashboards/freelancer-dashboard"
import { DashboardHeader } from "@/components/dashboard-header"

export default function FreelancerDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <DashboardHeader />
          <FreelancerDashboard />
        </div>
      </div>
    </main>
  )
}
