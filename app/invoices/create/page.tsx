import { DashboardHeader } from "@/components/dashboard-header"
import { CreateInvoiceForm } from "@/components/forms/create-invoice-form"

export default function CreateInvoicePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <DashboardHeader />
          <div className="p-6">
            <CreateInvoiceForm />
          </div>
        </div>
      </div>
    </main>
  )
}
