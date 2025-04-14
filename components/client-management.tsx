"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { ClientDetailsModal } from "@/components/modals/client-details-modal"

// Sample client data
const clients = [
  {
    id: "1",
    name: "Raj Mehra",
    email: "raj@gmail.com",
    paid: "32,000",
    pending: "8,000",
  },
  {
    id: "2",
    name: "Swiggy India",
    email: "contact@swiggy.com",
    paid: "1,20,000",
    pending: "0",
  },
  {
    id: "3",
    name: "Sara Ali",
    email: "sara@modelmail.com",
    paid: "40,000",
    pending: "2,000",
  },
]

export function ClientManagement() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/clients/add">Add Client</Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 text-base font-semibold">Name</TableHead>
              <TableHead className="py-4 text-base font-semibold">Email</TableHead>
              <TableHead className="py-4 text-base font-semibold">Paid (₹)</TableHead>
              <TableHead className="py-4 text-base font-semibold">Pending (₹)</TableHead>
              <TableHead className="py-4 text-base font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="py-4 font-medium">{client.name}</TableCell>
                <TableCell className="py-4">{client.email}</TableCell>
                <TableCell className="py-4">{client.paid}</TableCell>
                <TableCell className="py-4">{client.pending}</TableCell>
                <TableCell className="py-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="text-blue-600 border-gray-200"
                      onClick={() => setSelectedClient(client.id)}
                    >
                      View
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Client Details Modal */}
      <ClientDetailsModal isOpen={selectedClient !== null} onClose={() => setSelectedClient(null)} />
    </div>
  )
}
