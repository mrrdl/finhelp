import { DashboardHeader } from "@/components/dashboard-header"
import { InvoicesList } from "@/components/invoices-list"

export default function InvoicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <DashboardHeader />
          <InvoicesList />
        </div>
      </div>
    </main>
  )
}
