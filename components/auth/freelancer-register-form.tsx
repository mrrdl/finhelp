"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const PROFESSIONS = [
  { id: "designer", name: "Designer", category: "creative" },
  { id: "developer", name: "Developer", category: "tech" },
  { id: "writer", name: "Writer/Content Creator", category: "creative" },
  { id: "marketer", name: "Digital Marketer", category: "marketing" },
  { id: "consultant", name: "Consultant", category: "professional" },
  { id: "teacher", name: "Teacher/Tutor", category: "education" },
  { id: "photographer", name: "Photographer", category: "creative" },
  { id: "accountant", name: "Accountant", category: "finance" },
  { id: "translator", name: "Translator", category: "language" },
  { id: "virtual_assistant", name: "Virtual Assistant", category: "admin" },
  { id: "other", name: "Other", category: "other" },
]

export function FreelancerRegisterForm() {
  const router = useRouter()
  const { login } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [bankAuthStep, setBankAuthStep] = useState(0)
  const [paymentAuthStep, setPaymentAuthStep] = useState(0)
  const [activePaymentProcessor, setActivePaymentProcessor] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
    experience: "1-3",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountType: "savings",
    swiftCode: "",
    routingNumber: "",
    paymentProcessors: [] as string[],
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
    console.log("Register as freelancer:", formData)

    // Store profession and payment processors in localStorage
    localStorage.setItem("finhelp-profession", formData.profession)
    localStorage.setItem("finhelp-experience", formData.experience)
    localStorage.setItem("finhelp-payment-processors", JSON.stringify(formData.paymentProcessors))

    // Login the user
    login("freelancer", formData.name)

    // Redirect to dashboard
    router.push("/")
  }

  const startBankAuth = (type: "indian" | "international") => {
    setBankAuthStep(1)
    // In a real app, this would initiate the bank authentication process
    setTimeout(() => {
      setBankAuthStep(2)
    }, 2000)
  }

  const startPaymentProcessorAuth = (processor: string) => {
    setActivePaymentProcessor(processor)
    setPaymentAuthStep(1)

    // In a real app, this would redirect to the payment processor's auth page
    setTimeout(() => {
      setPaymentAuthStep(2)
      // Add the processor to the list of connected processors
      if (!formData.paymentProcessors.includes(processor)) {
        setFormData((prev) => ({
          ...prev,
          paymentProcessors: [...prev.paymentProcessors, processor],
        }))
      }
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="freelancer-name">Full Name</Label>
        <Input
          id="freelancer-name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="freelancer-email">Email</Label>
        <Input
          id="freelancer-email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="freelancer-password">Password</Label>
        <div className="relative">
          <Input
            id="freelancer-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        <Select value={formData.profession} onValueChange={(value) => handleSelectChange("profession", value)} required>
          <SelectTrigger id="profession">
            <SelectValue placeholder="Select your profession" />
          </SelectTrigger>
          <SelectContent>
            {PROFESSIONS.map((profession) => (
              <SelectItem key={profession.id} value={profession.id}>
                {profession.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Select value={formData.experience} onValueChange={(value) => handleSelectChange("experience", value)}>
          <SelectTrigger id="experience">
            <SelectValue placeholder="Select your experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="<1">Less than 1 year</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value=">10">More than 10 years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Bank Details</Label>
        <Tabs defaultValue="indian" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="indian">Indian Bank</TabsTrigger>
            <TabsTrigger value="international">International Bank</TabsTrigger>
          </TabsList>

          <TabsContent value="indian" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                placeholder="SBIN0000123"
                value={formData.ifscCode}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                placeholder="State Bank of India"
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                defaultValue={formData.accountType}
                onValueChange={(value) => handleSelectChange("accountType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                className="w-full"
                variant={bankAuthStep === 0 ? "default" : "outline"}
                disabled={bankAuthStep > 0}
                onClick={() => startBankAuth("indian")}
              >
                {bankAuthStep === 0 && "Verify with XYZ Authentication"}
                {bankAuthStep === 1 && "Verifying..."}
                {bankAuthStep === 2 && (
                  <span className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Verified with XYZ
                  </span>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="international" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="intAccountNumber">Account Number</Label>
              <Input
                id="intAccountNumber"
                name="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
              <Input
                id="swiftCode"
                name="swiftCode"
                placeholder="CHASUS33XXX"
                value={formData.swiftCode}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                name="routingNumber"
                placeholder="021000021"
                value={formData.routingNumber}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intBankName">Bank Name</Label>
              <Input
                id="intBankName"
                name="bankName"
                placeholder="Chase Bank"
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>

            <div className="pt-2">
              <Button
                type="button"
                className="w-full"
                variant={bankAuthStep === 0 ? "default" : "outline"}
                disabled={bankAuthStep > 0}
                onClick={() => startBankAuth("international")}
              >
                {bankAuthStep === 0 && "Verify International Bank Account"}
                {bankAuthStep === 1 && "Verifying..."}
                {bankAuthStep === 2 && (
                  <span className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Verified
                  </span>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label>Payment Processors</Label>
        <p className="text-sm text-gray-500 mb-4">
          Connect payment processors to track your income and improve your FinFit score
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={formData.paymentProcessors.includes("paypal") ? "border-green-200" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">PayPal</CardTitle>
              <CardDescription>For international clients</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {formData.paymentProcessors.includes("paypal") ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span>Connected</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Connect your PayPal account</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant={formData.paymentProcessors.includes("paypal") ? "outline" : "default"}
                className="w-full"
                onClick={() => startPaymentProcessorAuth("paypal")}
                disabled={paymentAuthStep === 1 && activePaymentProcessor === "paypal"}
              >
                {paymentAuthStep === 1 && activePaymentProcessor === "paypal"
                  ? "Connecting..."
                  : formData.paymentProcessors.includes("paypal")
                    ? "Reconnect"
                    : "Connect PayPal"}
              </Button>
            </CardFooter>
          </Card>

          <Card className={formData.paymentProcessors.includes("razorpay") ? "border-green-200" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Razorpay</CardTitle>
              <CardDescription>For Indian clients</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {formData.paymentProcessors.includes("razorpay") ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span>Connected</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Connect your Razorpay account</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant={formData.paymentProcessors.includes("razorpay") ? "outline" : "default"}
                className="w-full"
                onClick={() => startPaymentProcessorAuth("razorpay")}
                disabled={paymentAuthStep === 1 && activePaymentProcessor === "razorpay"}
              >
                {paymentAuthStep === 1 && activePaymentProcessor === "razorpay"
                  ? "Connecting..."
                  : formData.paymentProcessors.includes("razorpay")
                    ? "Reconnect"
                    : "Connect Razorpay"}
              </Button>
            </CardFooter>
          </Card>

          <Card className={formData.paymentProcessors.includes("stripe") ? "border-green-200" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stripe</CardTitle>
              <CardDescription>For global payments</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {formData.paymentProcessors.includes("stripe") ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span>Connected</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Connect your Stripe account</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant={formData.paymentProcessors.includes("stripe") ? "outline" : "default"}
                className="w-full"
                onClick={() => startPaymentProcessorAuth("stripe")}
                disabled={paymentAuthStep === 1 && activePaymentProcessor === "stripe"}
              >
                {paymentAuthStep === 1 && activePaymentProcessor === "stripe"
                  ? "Connecting..."
                  : formData.paymentProcessors.includes("stripe")
                    ? "Reconnect"
                    : "Connect Stripe"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={bankAuthStep !== 2 || formData.profession === ""}
      >
        Create Account
      </Button>
    </form>
  )
}
