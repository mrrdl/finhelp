"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

// Sample invoice data
const invoices = [
  {
    id: "INV-00010",
    client: "Raj Mehra",
    clientId: "CLT-00285",
    date: "04/25/2024",
    amount: "Paid",
    status: "Paid",
  },
  {
    id: "INV-00009",
    client: "Ananya Sen",
    clientId: "CLT-00712",
    date: "04/24/2024",
    amount: "Pending",
    status: "Pending",
  },
  {
    id: "INV-00008",
    client: "Raj Mehra",
    clientId: "INV-00010",
    date: "04/19/2024",
    amount: "Paid",
    status: "Paid",
  },
  {
    id: "INV-00007",
    client: "Ananya Sen",
    clientId: "INV-00019",
    date: "04/15/2024",
    amount: "Pending",
    status: "Pending",
  },
  {
    id: "INV-00006",
    client: "Raj Mehra",
    clientId: "INV-00009",
    date: "04/12/2024",
    amount: "Paid",
    status: "Paid",
  },
  {
    id: "INV-00005",
    client: "Ananya Sen",
    clientId: "INV-00062",
    date: "04/10/2024",
    amount: "Pending",
    status: "Pending",
  },
  {
    id: "INV-00014",
    client: "Ananya Sen",
    clientId: "CLT-00072",
    date: "04/15/2024",
    amount: "Paid",
    status: "Paid",
  },
]

export function InvoicesList() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/invoices/create">New Invoice</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="py-4 text-base font-semibold">Client</TableHead>
            <TableHead className="py-4 text-base font-semibold">Invoice ID</TableHead>
            <TableHead className="py-4 text-base font-semibold">Date</TableHead>
            <TableHead className="py-4 text-base font-semibold">Amount</TableHead>
            <TableHead className="py-4 text-base font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="border-b">
              <TableCell className="py-4">
                <div>
                  <div className="font-medium">{invoice.client}</div>
                  <div className="text-sm text-gray-500">({invoice.clientId})</div>
                </div>
              </TableCell>
              <TableCell className="py-4">{invoice.id}</TableCell>
              <TableCell className="py-4">{invoice.date}</TableCell>
              <TableCell className="py-4">
                <div
                  className={`px-3 py-1 rounded-full inline-block text-sm ${
                    invoice.amount === "Paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {invoice.amount}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div
                  className={`px-3 py-1 rounded-full inline-block text-sm ${
                    invoice.status === "Paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {invoice.status}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
