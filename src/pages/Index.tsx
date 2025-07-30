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
          value="0"
          subtitle="This month"
          icon={Shield}
        />
        <StatsCard
          title="Quality Score"
          value="--"
          subtitle="Average score"
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Issues"
          value="0"
          subtitle="Requires attention"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Pass Rate"
          value="--"
          subtitle="This week"
          icon={CheckCircle2}
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
            value="1"
            subtitle="Active now"
            icon={Users}
          />
          <StatsCard
            title="Avg. Inspection Time"
            value="--"
            subtitle="Per inspection"
            icon={Clock}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
