"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calculator, Calendar, CheckCircle, HelpCircle, Info, Percent, Wallet } from "lucide-react"
import { useUser } from "@/contexts/user-context"

// Indian tax slabs for FY 2024-25 (simplified)
const TAX_SLABS_OLD = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 750000, rate: 10 },
  { min: 750000, max: 1000000, rate: 15 },
  { min: 1000000, max: 1250000, rate: 20 },
  { min: 1250000, max: 1500000, rate: 25 },
  { min: 1500000, max: Number.POSITIVE_INFINITY, rate: 30 },
]

// New tax regime
const TAX_SLABS_NEW = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 5 },
  { min: 600000, max: 900000, rate: 10 },
  { min: 900000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Number.POSITIVE_INFINITY, rate: 30 },
]

// Tax deductions available
const TAX_DEDUCTIONS = [
  { id: "80c", name: "Section 80C", description: "Investments in PPF, ELSS, etc.", maxAmount: 150000 },
  { id: "80d", name: "Section 80D", description: "Health Insurance Premium", maxAmount: 25000 },
  { id: "80tta", name: "Section 80TTA", description: "Interest on Savings Account", maxAmount: 10000 },
  { id: "hra", name: "HRA Exemption", description: "House Rent Allowance", maxAmount: null },
  { id: "80g", name: "Section 80G", description: "Donations to Charitable Organizations", maxAmount: null },
  { id: "80e", name: "Section 80E", description: "Interest on Education Loan", maxAmount: null },
]

// Freelancer specific deductions
const FREELANCER_DEDUCTIONS = [
  { id: "rent", name: "Rent for Workspace", description: "Rent paid for home office or workspace", maxAmount: null },
  {
    id: "internet",
    name: "Internet & Phone",
    description: "Internet and phone expenses for business use",
    maxAmount: null,
  },
  {
    id: "equipment",
    name: "Equipment & Depreciation",
    description: "Depreciation on computers, equipment, etc.",
    maxAmount: null,
  },
  {
    id: "software",
    name: "Software Subscriptions",
    description: "Software and tools required for work",
    maxAmount: null,
  },
  {
    id: "travel",
    name: "Travel & Conveyance",
    description: "Business travel and local conveyance",
    maxAmount: null,
  },
]

// Gig worker specific deductions
const GIG_WORKER_DEDUCTIONS = [
  {
    id: "vehicle",
    name: "Vehicle Expenses",
    description: "Fuel, maintenance, and depreciation",
    maxAmount: null,
  },
  {
    id: "phone",
    name: "Phone & Internet",
    description: "Mobile and internet expenses for work",
    maxAmount: null,
  },
  {
    id: "uniform",
    name: "Uniform & Equipment",
    description: "Delivery bags, uniforms, etc.",
    maxAmount: null,
  },
  {
    id: "insurance",
    name: "Vehicle Insurance",
    description: "Insurance premium for work vehicle",
    maxAmount: null,
  },
]

export function TaxationPage() {
  const { userType, authStatus } = useUser()
  const [annualIncome, setAnnualIncome] = useState(800000)
  const [selectedRegime, setSelectedRegime] = useState<"old" | "new">("old")
  const [deductions, setDeductions] = useState<Record<string, number>>({
    "80c": 50000,
    "80d": 15000,
    "80tta": 5000,
    rent: 60000,
    internet: 24000,
    equipment: 30000,
    software: 20000,
    travel: 15000,
    vehicle: 40000,
    phone: 18000,
    uniform: 10000,
    insurance: 15000,
  })

  // Calculate taxable income
  const calculateTaxableIncome = () => {
    let totalDeductions = 0

    // Add standard deductions
    Object.keys(deductions).forEach((key) => {
      if (TAX_DEDUCTIONS.find((d) => d.id === key)) {
        const deduction = TAX_DEDUCTIONS.find((d) => d.id === key)
        if (deduction?.maxAmount) {
          totalDeductions += Math.min(deductions[key], deduction.maxAmount)
        } else {
          totalDeductions += deductions[key]
        }
      }
    })

    // Add profession-specific deductions
    if (userType === "freelancer") {
      FREELANCER_DEDUCTIONS.forEach((deduction) => {
        if (deductions[deduction.id]) {
          totalDeductions += deductions[deduction.id]
        }
      })
    } else if (userType === "gig-worker") {
      GIG_WORKER_DEDUCTIONS.forEach((deduction) => {
        if (deductions[deduction.id]) {
          totalDeductions += deductions[deduction.id]
        }
      })
    }

    // In new regime, most deductions are not allowed
    if (selectedRegime === "new") {
      return annualIncome
    }

    return Math.max(0, annualIncome - totalDeductions)
  }

  // Calculate tax based on regime
  const calculateTax = (taxableIncome: number, regime: "old" | "new") => {
    const slabs = regime === "old" ? TAX_SLABS_OLD : TAX_SLABS_NEW
    let tax = 0

    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i]
      if (taxableIncome > slab.min) {
        const taxableAmountInSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min)
        tax += (taxableAmountInSlab * slab.rate) / 100
      }
    }

    // Add 4% cess
    tax = tax * 1.04

    return Math.round(tax)
  }

  const taxableIncome = calculateTaxableIncome()
  const taxAmount = calculateTax(taxableIncome, selectedRegime)
  const effectiveTaxRate = (taxAmount / annualIncome) * 100

  // Check if user exceeds standard tax bracket
  const needsConsultation = annualIncome > 1000000

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tax Planning</h1>
          <p className="text-gray-500 mt-1">Optimize your taxes and maximize savings</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>Tax Calculator</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Book CA Consultation</Button>
        </div>
      </div>

      {needsConsultation && (
        <Card className="mb-8 bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Professional Tax Consultation Recommended</CardTitle>
                <CardDescription className="text-blue-700">
                  Your income exceeds ₹10,00,000, which puts you in a higher tax bracket. A professional consultation
                  could help you optimize your taxes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-4">
              Our partner CAs specialize in tax planning for {userType === "freelancer" ? "freelancers" : "gig workers"}{" "}
              and can help you:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-blue-700 mb-4">
              <li>Identify additional tax deductions specific to your work</li>
              <li>Optimize your income structure to minimize tax liability</li>
              <li>Ensure compliance with all tax regulations</li>
              <li>Plan investments for tax efficiency</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="bg-blue-600 hover:bg-blue-700">Schedule Free 30-Minute Consultation</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Annual Income</p>
              <h3 className="text-2xl font-bold">₹{annualIncome.toLocaleString()}</h3>
              <div className="flex items-center mt-1">
                <input
                  type="range"
                  min="100000"
                  max="2000000"
                  step="50000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-green-50 flex items-center justify-center">
              <Calculator className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Tax Payable</p>
              <h3 className="text-2xl font-bold">₹{taxAmount.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">
                Effective Tax Rate: {effectiveTaxRate.toFixed(1)}%
                <span className="ml-2 text-green-600">{selectedRegime === "old" ? "Old Regime" : "New Regime"}</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-purple-50 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Next Filing Deadline</p>
              <h3 className="text-2xl font-bold">July 31, 2025</h3>
              <p className="text-sm text-gray-500">For FY 2024-25 (AY 2025-26)</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Tax Regime Comparison</CardTitle>
              <CardDescription>Compare old vs new tax regime</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`p-4 rounded-lg border-2 ${
                  selectedRegime === "old" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => setSelectedRegime("old")}
                style={{ cursor: "pointer" }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Old Tax Regime</h3>
                  {selectedRegime === "old" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                </div>
                <p className="text-sm text-gray-600 mb-2">With deductions & exemptions</p>
                <div className="font-bold text-lg">
                  ₹{calculateTax(calculateTaxableIncome(), "old").toLocaleString()}
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 ${
                  selectedRegime === "new" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => setSelectedRegime("new")}
                style={{ cursor: "pointer" }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">New Tax Regime</h3>
                  {selectedRegime === "new" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                </div>
                <p className="text-sm text-gray-600 mb-2">Lower rates, no deductions</p>
                <div className="font-bold text-lg">₹{calculateTax(annualIncome, "new").toLocaleString()}</div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Recommendation</h4>
                    <p className="text-sm text-gray-600">
                      {calculateTax(calculateTaxableIncome(), "old") <= calculateTax(annualIncome, "new")
                        ? "The Old Tax Regime is better for you as you can claim deductions."
                        : "The New Tax Regime is better for you with lower tax rates."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tax Breakdown</CardTitle>
              <CardDescription>
                Based on {selectedRegime === "old" ? "Old" : "New"} Tax Regime for FY 2024-25
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Gross Annual Income</span>
                    <span className="font-medium">₹{annualIncome.toLocaleString()}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                {selectedRegime === "old" && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Total Deductions</span>
                      <span className="font-medium">₹{(annualIncome - taxableIncome).toLocaleString()}</span>
                    </div>
                    <Progress value={((annualIncome - taxableIncome) / annualIncome) * 100} className="h-2 bg-gray-200">
                      <div className="h-full bg-green-500 rounded-full" />
                    </Progress>
                  </div>
                )}

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Taxable Income</span>
                    <span className="font-medium">₹{taxableIncome.toLocaleString()}</span>
                  </div>
                  <Progress value={(taxableIncome / annualIncome) * 100} className="h-2 bg-gray-200">
                    <div className="h-full bg-blue-500 rounded-full" />
                  </Progress>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Tax Amount</span>
                    <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <Progress value={(taxAmount / annualIncome) * 100} className="h-2 bg-gray-200">
                    <div className="h-full bg-red-500 rounded-full" />
                  </Progress>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Net Income (After Tax)</span>
                    <span className="font-medium">₹{(annualIncome - taxAmount).toLocaleString()}</span>
                  </div>
                  <Progress value={((annualIncome - taxAmount) / annualIncome) * 100} className="h-2 bg-gray-200">
                    <div className="h-full bg-green-600 rounded-full" />
                  </Progress>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Percent className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium">Effective Tax Rate</h3>
                    </div>
                    <p className="text-2xl font-bold">{effectiveTaxRate.toFixed(1)}%</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Wallet className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium">Monthly Take-Home</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      ₹{Math.round((annualIncome - taxAmount) / 12).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="deductions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="deductions">Available Deductions</TabsTrigger>
          <TabsTrigger value="professional">Professional Deductions</TabsTrigger>
          <TabsTrigger value="tax-slabs">Tax Slabs</TabsTrigger>
        </TabsList>

        <TabsContent value="deductions">
          <Card>
            <CardHeader>
              <CardTitle>Standard Tax Deductions</CardTitle>
              <CardDescription>These deductions are available under the Old Tax Regime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TAX_DEDUCTIONS.map((deduction) => (
                  <div key={deduction.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{deduction.name}</h3>
                        <p className="text-sm text-gray-500">{deduction.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        {deduction.maxAmount ? `Up to ₹${deduction.maxAmount.toLocaleString()}` : "Variable"}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm text-gray-600 mb-1 block">Your Claim</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">₹</span>
                        <input
                          type="number"
                          className="w-full rounded-md border border-gray-300 p-2"
                          value={deductions[deduction.id] || 0}
                          onChange={(e) =>
                            setDeductions({
                              ...deductions,
                              [deduction.id]: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>{userType === "freelancer" ? "Freelancer Deductions" : "Gig Worker Deductions"}</CardTitle>
              <CardDescription>Profession-specific deductions you can claim under the Old Tax Regime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(userType === "freelancer" ? FREELANCER_DEDUCTIONS : GIG_WORKER_DEDUCTIONS).map((deduction) => (
                  <div key={deduction.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{deduction.name}</h3>
                        <p className="text-sm text-gray-500">{deduction.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Business Expense
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm text-gray-600 mb-1 block">Your Claim</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">₹</span>
                        <input
                          type="number"
                          className="w-full rounded-md border border-gray-300 p-2"
                          value={deductions[deduction.id] || 0}
                          onChange={(e) =>
                            setDeductions({
                              ...deductions,
                              [deduction.id]: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">Need Help with Professional Deductions?</h3>
                    <p className="text-amber-700 text-sm mt-1">
                      Our tax experts can help you identify all eligible deductions specific to your profession and
                      maximize your tax savings.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-amber-200 text-amber-700 hover:bg-amber-100"
                    >
                      Book a Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-slabs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Old Tax Regime</CardTitle>
                <CardDescription>With deductions and exemptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TAX_SLABS_OLD.map((slab, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        taxableIncome > slab.min && taxableIncome <= slab.max
                          ? "bg-blue-50 border-blue-200"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          {slab.max === Number.POSITIVE_INFINITY ? (
                            <span>Above ₹{slab.min.toLocaleString()}</span>
                          ) : (
                            <span>
                              ₹{slab.min.toLocaleString()} - ₹{slab.max.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-transparent">
                          {slab.rate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Tax Regime</CardTitle>
                <CardDescription>Lower rates, no deductions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TAX_SLABS_NEW.map((slab, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        annualIncome > slab.min && annualIncome <= slab.max
                          ? "bg-blue-50 border-blue-200"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          {slab.max === Number.POSITIVE_INFINITY ? (
                            <span>Above ₹{slab.min.toLocaleString()}</span>
                          ) : (
                            <span>
                              ₹{slab.min.toLocaleString()} - ₹{slab.max.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-transparent">
                          {slab.rate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Tax Filing Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Self-Filing</CardTitle>
              <CardDescription>File your taxes on your own</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Free tax calculator</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Basic guidance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Document checklist</span>
                </li>
              </ul>
              <p className="text-2xl font-bold mb-1">Free</p>
              <p className="text-sm text-gray-500 mb-4">DIY approach</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50">
              <div className="absolute -top-3 right-4">
                <Badge className="bg-blue-600">Recommended</Badge>
              </div>
              <CardTitle>Assisted Filing</CardTitle>
              <CardDescription>Expert help with your tax filing</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Document review by experts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Deduction optimization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Error-free filing guarantee</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>30-minute expert consultation</span>
                </li>
              </ul>
              <p className="text-2xl font-bold mb-1">₹1,999</p>
              <p className="text-sm text-gray-500 mb-4">One-time payment</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Plan</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CA Consultation</CardTitle>
              <CardDescription>Full-service tax planning</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Dedicated CA for your taxes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Comprehensive tax planning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Investment advisory</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Year-round support</span>
                </li>
              </ul>
              <p className="text-2xl font-bold mb-1">₹4,999</p>
              <p className="text-sm text-gray-500 mb-4">One-time payment</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
