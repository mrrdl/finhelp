"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Users,
  CreditCard,
  Building,
  Home,
  Car,
  Briefcase,
  Smartphone,
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/contexts/user-context"
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

// Loan types and eligibility criteria
const LOAN_TYPES = [
  {
    id: "business_expansion",
    name: "Business Expansion Loan",
    description: "For expanding your business operations, hiring, or scaling up",
    minScore: 650,
    maxAmount: 1000000,
    interestRange: { min: 8.5, max: 12.5 },
    tenure: { min: 12, max: 60 },
    icon: Building,
    eligibleFor: ["freelancer"],
  },
  {
    id: "equipment_purchase",
    name: "Equipment Purchase Loan",
    description: "For buying professional equipment, tools, or technology",
    minScore: 600,
    maxAmount: 500000,
    interestRange: { min: 9.0, max: 13.0 },
    tenure: { min: 6, max: 36 },
    icon: Briefcase,
    eligibleFor: ["freelancer", "gig-worker"],
  },
  {
    id: "working_capital",
    name: "Working Capital Loan",
    description: "Short-term loan for day-to-day operational expenses",
    minScore: 620,
    maxAmount: 300000,
    interestRange: { min: 10.0, max: 14.0 },
    tenure: { min: 3, max: 24 },
    icon: CreditCard,
    eligibleFor: ["freelancer", "gig-worker"],
  },
  {
    id: "vehicle_loan",
    name: "Vehicle Loan",
    description: "For purchasing a vehicle for your delivery or business needs",
    minScore: 630,
    maxAmount: 400000,
    interestRange: { min: 9.5, max: 13.5 },
    tenure: { min: 12, max: 60 },
    icon: Car,
    eligibleFor: ["gig-worker"],
  },
  {
    id: "skill_development",
    name: "Skill Development Loan",
    description: "For courses, certifications, or training to enhance your skills",
    minScore: 580,
    maxAmount: 200000,
    interestRange: { min: 8.0, max: 12.0 },
    tenure: { min: 6, max: 36 },
    icon: Smartphone,
    eligibleFor: ["freelancer", "gig-worker"],
  },
  {
    id: "home_office",
    name: "Home Office Setup Loan",
    description: "For setting up or upgrading your home office",
    minScore: 600,
    maxAmount: 250000,
    interestRange: { min: 9.0, max: 13.0 },
    tenure: { min: 6, max: 24 },
    icon: Home,
    eligibleFor: ["freelancer"],
  },
]

export function FinFitScorePage() {
  const { userType, authStatus } = useUser()
  const [score, setScore] = useState(700)
  const [profession, setProfession] = useState<string>("other")
  const [experience, setExperience] = useState<string>("1-3")
  const [paymentProcessors, setPaymentProcessors] = useState<string[]>([])
  const [partnerApps, setPartnerApps] = useState<string[]>([])
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null)
  const [loanAmount, setLoanAmount] = useState<number>(0)
  const [loanTenure, setLoanTenure] = useState<number>(24)

  useEffect(() => {
    // Get user data from localStorage
    if (userType === "freelancer") {
      const storedProfession = localStorage.getItem("finhelp-profession")
      const storedExperience = localStorage.getItem("finhelp-experience")
      const storedProcessors = localStorage.getItem("finhelp-payment-processors")

      if (storedProfession) {
        setProfession(storedProfession)
      }

      if (storedExperience) {
        setExperience(storedExperience)
      }

      if (storedProcessors) {
        setPaymentProcessors(JSON.parse(storedProcessors))
      }
    } else if (userType === "gig-worker") {
      const storedApps = localStorage.getItem("finhelp-partner-apps")

      if (storedApps) {
        setPartnerApps(JSON.parse(storedApps))
      }
    }

    // Calculate score based on user type and data
    calculateFinFitScore()
  }, [userType])

  // Calculate FinFit score based on user type and data
  const calculateFinFitScore = () => {
    let baseScore = 700

    if (userType === "freelancer") {
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
    } else if (userType === "gig-worker") {
      // Adjust based on partner apps
      baseScore += partnerApps.length * 15

      // Adjust based on delivery history (simulated)
      baseScore += 25
    }

    const finalScore = Math.min(baseScore, 950)
    setScore(finalScore)

    // Set initial loan amount based on score
    const maxLoanAmount = calculateMaxLoanAmount(finalScore)
    setLoanAmount(Math.round(maxLoanAmount * 0.5))

    return finalScore
  }

  const calculateMaxLoanAmount = (score: number) => {
    // Base calculation for gig workers
    let maxAmount = 300000

    if (userType === "freelancer") {
      const professionInfo =
        PROFESSION_FACTORS[profession as keyof typeof PROFESSION_FACTORS] || PROFESSION_FACTORS.other
      maxAmount = professionInfo.maxLoanAmount
    } else if (userType === "gig-worker") {
      // Adjust based on number of partner apps
      maxAmount = 300000 + partnerApps.length * 50000
    }

    // Adjust based on score
    const scoreMultiplier = score / 700
    return Math.round(maxAmount * scoreMultiplier)
  }

  const maxLoanAmount = calculateMaxLoanAmount(score)
  const rating = calculateScoreType(score)

  // Get eligible loan types based on user type and score
  const eligibleLoanTypes = LOAN_TYPES.filter(
    (loan) => loan.minScore <= score && loan.eligibleFor.includes(userType || "freelancer"),
  )

  // Get recommended loan type
  const recommendedLoanType = eligibleLoanTypes.length > 0 ? eligibleLoanTypes[0] : null

  // Calculate EMI for selected loan
  const calculateEMI = (principal: number, tenure: number, interestRate: number) => {
    const monthlyRate = interestRate / 12 / 100
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    return Math.round(emi)
  }

  // Get selected loan details
  const selectedLoan = selectedLoanType ? LOAN_TYPES.find((loan) => loan.id === selectedLoanType) : recommendedLoanType

  // Calculate EMI for current loan selection
  const emi = selectedLoan
    ? calculateEMI(loanAmount, loanTenure, (selectedLoan.interestRange.min + selectedLoan.interestRange.max) / 2)
    : 0

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your FinFit Score</h1>
          <p className="text-gray-500 mt-1">Updated as of April 12, 2025</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">Apply for Financing</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Your Score</h2>
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg className="w-48 h-48" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray="282.7"
                  strokeDashoffset={(1 - score / 1000) * 282.7}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{score}</span>
                <span className="text-lg text-blue-600 font-medium">{rating}</span>
              </div>
            </div>
            <div className="w-full mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${(score / 1000) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-sm mt-1 text-gray-500">
                <span>0</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          {userType === "freelancer" && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-medium text-gray-600">Key Factors for Your Profession</h3>
              <ul className="space-y-1 text-sm">
                {(
                  PROFESSION_FACTORS[profession as keyof typeof PROFESSION_FACTORS] || PROFESSION_FACTORS.other
                ).scoreFactors.map((factor, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-2" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {userType === "gig-worker" && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-medium text-gray-600">Key Factors for Gig Workers</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-2" />
                  Delivery Consistency
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-2" />
                  Platform Diversity ({partnerApps.length} platforms)
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-2" />
                  Earnings Stability
                </li>
              </ul>
            </div>
          )}
        </Card>

        <Card className="md:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Loan Eligibility</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Maximum Loan Amount</span>
              <span className="font-bold text-2xl">₹{maxLoanAmount.toLocaleString()}</span>
            </div>
            <Progress value={(score / 1000) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                {recommendedLoanType && <recommendedLoanType.icon className="h-5 w-5 text-blue-600 mr-2" />}
                <h3 className="font-medium">Recommended Loan Type</h3>
              </div>
              <p className="text-gray-600">{recommendedLoanType?.name || "Not eligible for loans yet"}</p>
              {recommendedLoanType && <p className="text-xs text-gray-500 mt-1">{recommendedLoanType.description}</p>}
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium">Interest Rate Range</h3>
              </div>
              <p className="text-gray-600">
                {recommendedLoanType
                  ? `${recommendedLoanType.interestRange.min}% - ${recommendedLoanType.interestRange.max}%`
                  : "Not applicable"}
              </p>
              {recommendedLoanType && (
                <p className="text-xs text-gray-500 mt-1">
                  Tenure: {recommendedLoanType.tenure.min} - {recommendedLoanType.tenure.max} months
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Improve your score by 50 points to unlock:</h3>
                <p className="text-blue-700 mt-1">
                  Additional ₹{Math.round(maxLoanAmount * 0.15).toLocaleString()} in loan eligibility and 0.5% lower
                  interest rates
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Loan Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Loan Type</label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={selectedLoanType || recommendedLoanType?.id || ""}
                  onChange={(e) => setSelectedLoanType(e.target.value)}
                >
                  {eligibleLoanTypes.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      {loan.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Loan Amount (₹)</label>
                <input
                  type="range"
                  min={Math.round(maxLoanAmount * 0.1)}
                  max={maxLoanAmount}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>₹{Math.round(maxLoanAmount * 0.1).toLocaleString()}</span>
                  <span>₹{loanAmount.toLocaleString()}</span>
                  <span>₹{maxLoanAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tenure (months)</label>
                <input
                  type="range"
                  min={selectedLoan?.tenure.min || 6}
                  max={selectedLoan?.tenure.max || 60}
                  step={1}
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{selectedLoan?.tenure.min || 6} months</span>
                  <span>{loanTenure} months</span>
                  <span>{selectedLoan?.tenure.max || 60} months</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Loan Amount</h3>
                  <p className="text-2xl font-bold">₹{loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tenure</h3>
                  <p className="text-2xl font-bold">{loanTenure} months</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Interest Rate</h3>
                  <p className="text-2xl font-bold">
                    {selectedLoan
                      ? ((selectedLoan.interestRange.min + selectedLoan.interestRange.max) / 2).toFixed(1)
                      : "0"}
                    %
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly EMI</h3>
                  <p className="text-2xl font-bold">₹{emi.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-medium">₹{Math.round(emi * loanTenure - loanAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">₹{Math.round(emi * loanTenure).toLocaleString()}</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply for This Loan</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="eligible" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="eligible">Eligible Loan Types</TabsTrigger>
          <TabsTrigger value="history">Score History</TabsTrigger>
        </TabsList>

        <TabsContent value="eligible">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eligibleLoanTypes.map((loan) => (
              <Card key={loan.id} className="p-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <loan.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{loan.name}</h3>
                    <p className="text-sm text-gray-500">{loan.description}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Amount</span>
                    <span className="font-medium">₹{Math.min(loan.maxAmount, maxLoanAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-medium">
                      {loan.interestRange.min}% - {loan.interestRange.max}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tenure</span>
                    <span className="font-medium">
                      {loan.tenure.min} - {loan.tenure.max} months
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedLoanType(loan.id)
                    setLoanAmount(Math.min(loan.maxAmount, maxLoanAmount) / 2)
                    setLoanTenure(Math.floor((loan.tenure.min + loan.tenure.max) / 2))
                    window.scrollTo({ top: 500, behavior: "smooth" })
                  }}
                >
                  Calculate EMI
                </Button>
              </Card>
            ))}

            {LOAN_TYPES.filter(
              (loan) => loan.minScore > score && loan.eligibleFor.includes(userType || "freelancer"),
            ).map((loan) => (
              <Card key={loan.id} className="p-6 bg-gray-50 border-gray-200">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <loan.icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-500">{loan.name}</h3>
                      <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-500">
                        Locked
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{loan.description}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Required Score</span>
                    <span>{loan.minScore}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Your Score</span>
                    <span>{score}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Points Needed</span>
                    <span>{loan.minScore - score}</span>
                  </div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-500">
                  Improve your score by {loan.minScore - score} points to unlock this loan type
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Score History</h2>
            <div className="h-[300px] w-full">
              <ScoreHistoryChart />
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <ArrowUp className="h-5 w-5 text-green-500 mr-2" />
                  <span>March 2025</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">+25 points</span>
                  <span className="text-gray-500">
                    ({score - 25} → {score})
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <ArrowUp className="h-5 w-5 text-green-500 mr-2" />
                  <span>February 2025</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">+12 points</span>
                  <span className="text-gray-500">
                    ({score - 37} → {score - 25})
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <ArrowDown className="h-5 w-5 text-red-500 mr-2" />
                  <span>January 2025</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">-8 points</span>
                  <span className="text-gray-500">
                    ({score - 29} → {score - 37})
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">How Your FinFit Score is Calculated</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-start mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3 p-1.5 bg-blue-100 rounded-full" />
              <h3 className="text-lg font-semibold">Income Stability (35%)</h3>
            </div>
            <p className="text-gray-600">
              Based on your consistent income patterns, monthly revenue trends, and income diversity.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start mb-4">
              <Clock className="h-8 w-8 text-blue-600 mr-3 p-1.5 bg-blue-100 rounded-full" />
              <h3 className="text-lg font-semibold">Payment History (30%)</h3>
            </div>
            <p className="text-gray-600">
              Measures how reliably you receive payments from clients and your invoice payment rates.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start mb-4">
              <Users className="h-8 w-8 text-blue-600 mr-3 p-1.5 bg-blue-100 rounded-full" />
              <h3 className="text-lg font-semibold">
                {userType === "freelancer" ? "Client Quality (25%)" : "Platform Diversity (25%)"}
              </h3>
            </div>
            <p className="text-gray-600">
              {userType === "freelancer"
                ? "Evaluates your client base diversity, client retention rates, and client payment reliability."
                : "Assesses your activity across multiple delivery platforms and consistency of earnings."}
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/finfit/improve" className="flex items-center text-blue-600 font-medium hover:underline">
          View detailed recommendations to improve your score
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function calculateScoreType(score: number) {
  if (score <= 500) return "Poor"
  if (score <= 650) return "Fair"
  if (score <= 750) return "Good"
  if (score <= 850) return "Very Good"
  return "Excellent"
}

function ScoreHistoryChart() {
  return (
    <div className="w-full h-full flex items-end">
      {/* This is a simplified chart representation */}
      <div className="w-full h-full relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>800</span>
          <span>750</span>
          <span>700</span>
          <span>650</span>
          <span>600</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full flex items-end">
          <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="1000" y2="0" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="60" x2="1000" y2="60" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="120" x2="1000" y2="120" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="180" x2="1000" y2="180" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="240" x2="1000" y2="240" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="300" x2="1000" y2="300" stroke="#e5e7eb" strokeWidth="1" />

            {/* Score line */}
            <path
              d="M0,200 L125,190 L250,180 L375,160 L500,170 L625,150 L750,130 L875,110 L1000,90"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />

            {/* Area under the line */}
            <path
              d="M0,200 L125,190 L250,180 L375,160 L500,170 L625,150 L750,130 L875,110 L1000,90 L1000,300 L0,300 Z"
              fill="url(#scoreGradient)"
              opacity="0.2"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="ml-8 mt-2 flex justify-between text-xs text-gray-500">
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
        </div>
      </div>
    </div>
  )
}
