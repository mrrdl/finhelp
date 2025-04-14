"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X } from "lucide-react"

// Sample client details
const clientDetails = {
  name: "Acme Corporation",
  email: "contact@acme.com",
  phone: "+1 123 456 7890",
  address: "123 Elm St, Springfield, USA",
  paid: "$8,200.00",
  pending: "$1,200.00",
  invoices: [
    { id: "1005", date: "Apr 20, 2024", amount: "$500.00", status: "Unpaid" },
    { id: "1004", date: "Mar 15, 2024", amount: "$3,700.00", status: "Paid" },
    { id: "1002", date: "Mar 5, 2024", amount: "$4,000.00", status: "Paid" },
  ],
}

interface ClientDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ClientDetailsModal({ isOpen, onClose }: ClientDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Client Details</DialogTitle>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">{clientDetails.name}</h2>
          <p className="text-gray-600 mb-6">{clientDetails.email}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-gray-600 mb-2">Phone</h3>
              <p className="font-medium">{clientDetails.phone}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-gray-600 mb-2">Address</h3>
              <p className="font-medium">{clientDetails.address}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-gray-600 mb-2">Paid</h3>
              <p className="font-bold text-xl">{clientDetails.paid}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-gray-600 mb-2">Pending</h3>
              <p className="font-bold text-xl">{clientDetails.pending}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Invoices</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientDetails.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">#{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <span className={`text-${invoice.status === "Paid" ? "green" : "red"}-600`}>{invoice.status}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
