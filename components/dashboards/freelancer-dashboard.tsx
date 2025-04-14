"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Globe, DollarSign, BarChart4, FileText, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Profession-specific score factors
const PROFESSION_FACTORS = {
  designer: {
    title: "Designer",
    scoreFactors: ["Portfolio Quality", "Client Diversity", "Project Complexity"],
    maxLoanAmount: 800000,
  },
  developer: {
    title: "Developer",
    scoreFactors: ["Technical Expertise", "Project Completion Rate", "Code Quality Metrics"],
    maxLoanAmount: 1000000,
  },
  writer: {
    title: "Writer/Content Creator",
    scoreFactors: ["Content Engagement", "Publication Diversity", "Deadline Adherence"],
    maxLoanAmount: 600000,
  },
  marketer: {
    title: "Digital Marketer",
    scoreFactors: ["Campaign Performance", "Client Retention", "ROI Metrics"],
    maxLoanAmount: 750000,
  },
  consultant: {
    title: "Consultant",
    scoreFactors: ["Client Testimonials", "Project Impact", "Industry Recognition"],
    maxLoanAmount: 900000,
  },
  teacher: {
    title: "Teacher/Tutor",
    scoreFactors: ["Student Outcomes", "Session Consistency", "Subject Expertise"],
    maxLoanAmount: 500000,
  },
  photographer: {
    title: "Photographer",
    scoreFactors: ["Portfolio Quality", "Client Diversity", "Equipment Investment"],
    maxLoanAmount: 650000,
  },
  accountant: {
    title: "Accountant",
    scoreFactors: ["Client Retention", "Certification Level", "Service Diversity"],
    maxLoanAmount: 850000,
  },
  translator: {
    title: "Translator",
    scoreFactors: ["Language Proficiency", "Specialization", "Turnaround Time"],
    maxLoanAmount: 550000,
  },
  virtual_assistant: {
    title: "Virtual Assistant",
    scoreFactors: ["Task Diversity", "Client Retention", "Response Time"],
    maxLoanAmount: 450000,
  },
  other: {
    title: "Freelancer",
    scoreFactors: ["Client Diversity", "Income Stability", "Project Completion Rate"],
    maxLoanAmount: 600000,
  },
}

export function FreelancerDashboard() {
  const [profession, setProfession] = useState<string>("other")
  const [experience, setExperience] = useState<string>("1-3")
  const [paymentProcessors, setPaymentProcessors] = useState<string[]>([])
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    // Get profession, experience, and payment processors from localStorage
    const storedProfession = localStorage.getItem("finhelp-profession")
    const storedExperience = localStorage.getItem("finhelp-experience")
    const storedProcessors = localStorage.getItem("finhelp-payment-processors")
    const storedName = localStorage.getItem("finhelp-user-name")

    if (storedProfession) {
      setProfession(storedProfession)
    }

    if (storedExperience) {
      setExperience(storedExperience)
    }

    if (storedProcessors) {
      setPaymentProcessors(JSON.parse(storedProcessors))
    }

    if (storedName) {
      setUserName(storedName)
    }
  }, [])

  // Calculate FinFit score based on profession and experience
  const calculateFinFitScore = () => {
    let baseScore = 700

    // Adjust based on profession
    const professionFactor = {
      developer: 50,
      designer: 40,
      writer: 30,
      marketer: 35,
      consultant: 45,
      teacher: 25,
      photographer: 30,
      accountant: 40,
      translator: 25,
      virtual_assistant: 20,
      other: 30,
    }

    baseScore += professionFactor[profession as keyof typeof professionFactor] || 30

    // Adjust based on experience
    const experienceFactor = {
      "<1": 0,
      "1-3": 15,
      "3-5": 30,
      "5-10": 45,
      ">10": 60,
    }

    baseScore += experienceFactor[experience as keyof typeof experienceFactor] || 15

    // Adjust based on payment processors
    baseScore += paymentProcessors.length * 10

    return Math.min(baseScore, 950)
  }

  const finFitScore = calculateFinFitScore()
  const professionInfo = PROFESSION_FACTORS[profession as keyof typeof PROFESSION_FACTORS] || PROFESSION_FACTORS.other
  const maxLoanAmount = professionInfo.maxLoanAmount * (finFitScore / 700)

  // Sample data for a freelancer
  const freelancerData = {
    profession: professionInfo.title,
    earnings: {
      thisMonth: 85000,
      lastMonth: 72000,
      pending: 35000,
    },
    projects: {
      active: 3,
      completed: 24,
      inProgress: 2,
    },
    nextInvoiceDue: "Apr 20, 2025",
    recentInvoices: [
      { id: "INV-00012", client: "TechCorp Inc.", amount: 25000, status: "Paid", date: "Apr 10, 2025" },
      { id: "INV-00011", client: "Global Solutions", amount: 18000, status: "Pending", date: "Apr 5, 2025" },
      { id: "INV-00010", client: "Innovate Studios", amount: 35000, status: "Pending", date: "Mar 28, 2025" },
    ],
    clientDistribution: {
      domestic: 65,
      international: 35,
    },
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
          <p className="text-gray-500 mt-1">{professionInfo.title}</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">Create Invoice</Button>
      </div>

      {/* Payment Processor Alert */}
      {paymentProcessors.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Payment Processors Connected</h3>
            <p className="text-blue-700 text-sm">
              We're tracking your income from {paymentProcessors.length} payment processor
              {paymentProcessors.length > 1 ? "s" : ""}:{" "}
              {paymentProcessors.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}
            </p>
          </div>
        </div>
      )}

      {paymentProcessors.length === 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Connect Payment Processors</h3>
            <p className="text-amber-700 text-sm">
              Connect your payment processors to track your income and improve your FinFit score.
            </p>
            <Button variant="outline" size="sm" className="mt-2 border-amber-200 text-amber-700 hover:bg-amber-100">
              <Link href="/profile">Connect Now</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-green-50 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Monthly Earnings</p>
              <h3 className="text-2xl font-bold">₹ {freelancerData.earnings.thisMonth.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">
                {freelancerData.earnings.thisMonth > freelancerData.earnings.lastMonth ? (
                  <span className="text-green-600">
                    ↑{" "}
                    {Math.round(
                      ((freelancerData.earnings.thisMonth - freelancerData.earnings.lastMonth) /
                        freelancerData.earnings.lastMonth) *
                        100,
                    )}
                    %
                  </span>
                ) : (
                  <span className="text-red-600">
                    ↓{" "}
                    {Math.round(
                      ((freelancerData.earnings.lastMonth - freelancerData.earnings.thisMonth) /
                        freelancerData.earnings.lastMonth) *
                        100,
                    )}
                    %
                  </span>
                )}{" "}
                vs last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Projects</p>
              <h3 className="text-2xl font-bold">{freelancerData.projects.active} Active</h3>
              <p className="text-sm text-gray-500">{freelancerData.projects.completed} completed all time</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-purple-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Pending Payments</p>
              <h3 className="text-2xl font-bold">₹ {freelancerData.earnings.pending.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Next invoice due: {freelancerData.nextInvoiceDue}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1 p-6">
          <h2 className="text-xl font-semibold mb-4">FinFit Score</h2>
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray="282.7"
                  strokeDashoffset={(1 - finFitScore / 1000) * 282.7}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{finFitScore}</span>
                <span className="text-sm text-green-600 font-medium">
                  {finFitScore >= 800 ? "Excellent" : finFitScore >= 650 ? "Good" : "Fair"}
                </span>
              </div>
            </div>
            <div className="mt-4 w-full space-y-2">
              <h3 className="text-sm font-medium text-gray-600">Key Factors for {professionInfo.title}s</h3>
              <ul className="space-y-1 text-sm">
                {professionInfo.scoreFactors.map((factor, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/finfit" className="mt-4 text-blue-600 font-medium hover:underline flex items-center">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Financing Eligibility</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Maximum Loan Amount</span>
              <span className="font-bold text-2xl">₹ {Math.round(maxLoanAmount).toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${(finFitScore / 950) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹ 0</span>
              <span>₹ {professionInfo.maxLoanAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium">Recommended Loan Type</h3>
              </div>
              <p className="text-gray-600">Business Expansion Loan</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <BarChart4 className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium">Interest Rate Range</h3>
              </div>
              <p className="text-gray-600">
                {finFitScore >= 800 ? "8.5% - 9.5%" : finFitScore >= 650 ? "9.5% - 11.0%" : "11.0% - 13.5%"}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Improve your score by 50 points to unlock:</h3>
                <p className="text-blue-700 mt-1">
                  Additional ₹{Math.round(professionInfo.maxLoanAmount * 0.1).toLocaleString()} in loan eligibility and
                  0.5% lower interest rates
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <div className="space-y-4">
            {freelancerData.recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{invoice.id}</div>
                  <div className="text-sm text-gray-500">
                    {invoice.client} • {invoice.date}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">₹ {invoice.amount.toLocaleString()}</span>
                  <Badge
                    variant="outline"
                    className={
                      invoice.status === "Paid"
                        ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-50"
                        : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/invoices" className="text-blue-600 font-medium hover:underline">
              View All Invoices
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">International Payment Optimization</h3>
                <p className="text-sm text-gray-600">
                  Save up to 3.5% on currency conversion with our recommended payment methods
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <BarChart4 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Tax Savings Opportunity</h3>
                <p className="text-sm text-gray-600">You may qualify for ₹25,000 in additional deductions</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Invoice Due Soon</h3>
                <p className="text-sm text-gray-600">Invoice #INV-00011 is due in 5 days</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
