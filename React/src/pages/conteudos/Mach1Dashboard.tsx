
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Calendar, Bell, TrendingUp, Target, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmConstrucao from '@/components/shared/EmConstrucao';
const Mach1Dashboard = () => {
  

  return (
    <>
      <Header
        title="Mach1%"
        description="Plataforma de crescimento e desenvolvimento"
      />
      <EmConstrucao>Mach1%</EmConstrucao>
    </>
  );
};

export default Mach1Dashboard;
