import { StatsCard } from "@/components/dashboard/StatsCard";
import { QualityChart } from "@/components/dashboard/QualityChart";
import { DefectAnalysis } from "@/components/dashboard/DefectAnalysis";
import { RecentInspections } from "@/components/dashboard/RecentInspections";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Users,
  Clock
} from "lucide-react";

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Quality Inspection Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor quality metrics, track inspections, and analyze trends in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Inspections"
          value="1,234"
          change="+12% from last month"
          changeType="positive"
          icon={Shield}
          subtitle="This month"
        />
        <StatsCard
          title="Quality Score"
          value="94.5%"
          change="+2.1% improvement"
          changeType="positive"
          icon={TrendingUp}
          subtitle="Average score"
        />
        <StatsCard
          title="Active Issues"
          value="8"
          change="-4 from yesterday"
          changeType="positive"
          icon={AlertTriangle}
          subtitle="Requires attention"
        />
        <StatsCard
          title="Pass Rate"
          value="96.2%"
          change="+1.5% improvement"
          changeType="positive"
          icon={CheckCircle2}
          subtitle="This week"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <QualityChart />
        <DefectAnalysis />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentInspections />
        
        <div className="space-y-6">
          <StatsCard
            title="Inspectors Online"
            value="12"
            subtitle="Active now"
            icon={Users}
          />
          <StatsCard
            title="Avg. Inspection Time"
            value="24 min"
            change="-3 min faster"
            changeType="positive"
            icon={Clock}
            subtitle="Per inspection"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
