import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const clients = [
  { id: 1, name: "Raj Mehra", amount: "₹ 8,000", status: "Paid" },
  { id: 2, name: "Swiggy India", amount: "1,20,000", status: "Paid" },
  { id: 3, name: "Sara Ali", amount: "₹3,000", status: "Paid" },
  { id: 4, name: "Rahul Kumar", amount: "₹ 7,000", status: "Pending" },
]

export function ClientsTable() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] font-semibold text-base">Client</TableHead>
            <TableHead className="font-semibold text-base">Amount</TableHead>
            <TableHead className="text-right font-semibold text-base">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.amount}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant="outline"
                  className={
                    client.status === "Paid"
                      ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-50"
                      : "bg-red-50 text-red-600 border-red-200 hover:bg-red-50"
                  }
                >
                  {client.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
