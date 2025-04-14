import { DashboardHeader } from "@/components/dashboard-header"
import { AddClientForm } from "@/components/forms/add-client-form"

export default function AddClientPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <DashboardHeader />
          <div className="flex justify-center p-6">
            <div className="w-full max-w-md">
              <AddClientForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
