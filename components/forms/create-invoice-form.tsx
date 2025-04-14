"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"

export function CreateInvoiceForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    client: "Raj Mehra (CLT-00235)",
    issueDate: "04/25/2024",
    description: "Logo Design",
    amount: "₹ 5,500",
    tax: "18%",
    currency: "INR",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Invoice data:", formData)
    // Here you would typically save the data to your backend
    router.push("/invoices")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Invoice</h1>

      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <Select defaultValue={formData.client} onValueChange={(value) => handleSelectChange("client", value)}>
          <SelectTrigger className="w-full">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Select client" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Raj Mehra (CLT-00235)">Raj Mehra (CLT-00235)</SelectItem>
            <SelectItem value="Swiggy India (CLT-00124)">Swiggy India (CLT-00124)</SelectItem>
            <SelectItem value="Sara Ali (CLT-00098)">Sara Ali (CLT-00098)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input id="issueDate" name="issueDate" value={formData.issueDate} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax">Tax</Label>
          <Input id="tax" name="tax" value={formData.tax} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select defaultValue={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="bg-white p-8 rounded-lg border shadow-sm">
            <div className="text-center text-3xl text-gray-400 font-light mb-8">INVOICE</div>
            <div className="h-20 bg-gray-100 rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push("/invoices")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Create Invoice
        </Button>
      </div>
    </form>
  )
}
