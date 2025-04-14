"use client"

import { useUser } from "@/contexts/user-context"
import { GigWorkerDashboard } from "@/components/dashboards/gig-worker-dashboard"
import { FreelancerDashboard } from "@/components/dashboards/freelancer-dashboard"
import { SimplifiedDashboard } from "@/components/simplified-dashboard"

export function DashboardContent() {
  const { userType, authStatus } = useUser()

  // If user is authenticated, show the appropriate dashboard
  if (authStatus === "authenticated") {
    if (userType === "gig-worker") {
      return <GigWorkerDashboard />
    }
    if (userType === "freelancer") {
      return <FreelancerDashboard />
    }
  }

  // Default simplified dashboard for unauthenticated users
  return <SimplifiedDashboard />
}
