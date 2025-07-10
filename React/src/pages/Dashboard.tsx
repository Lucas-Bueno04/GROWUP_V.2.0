
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { SimplifiedDashboard } from "@/components/dashboard/SimplifiedDashboard";
import { JwtService } from "@/components/auth/GetAuthParams";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  
  return (
  <div className="container mx-auto max-w-7xl p-6">
    <SimplifiedDashboard />
  </div>
  );
  

}
