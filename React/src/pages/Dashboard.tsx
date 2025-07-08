
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { SimplifiedDashboard } from "@/components/dashboard/SimplifiedDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  
  console.log("Dashboard - Rendering with user:", user);

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <SimplifiedDashboard />
    </div>
  );
}
