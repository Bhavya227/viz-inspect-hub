import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Target, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function QualityMetrics() {
  const { qualityMetrics, lastUpdated, recalculateMetrics } = useAppStore();

  // Auto-refresh metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      recalculateMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, [recalculateMetrics]);

  const getChangeType = (current: number, target: number): "positive" | "negative" => {
    return current >= target ? "positive" : "negative";
  };

  const getChange = (current: number, previous: number): string => {
    const change = current - previous;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  // Calculate changes from previous period
  const previousPeriod = qualityMetrics.monthlyTrends[qualityMetrics.monthlyTrends.length - 2];
  const currentPeriod = qualityMetrics.monthlyTrends[qualityMetrics.monthlyTrends.length - 1];

  const metrics = [
    {
      title: "Overall Quality Score",
      value: `${qualityMetrics.overallScore}%`,
      change: previousPeriod ? getChange(qualityMetrics.overallScore, previousPeriod.score) : "+3.2%",
      changeType: getChangeType(qualityMetrics.overallScore, 95),
      icon: Target,
      target: "95%"
    },
    {
      title: "Pass Rate",
      value: `${qualityMetrics.passRate}%`,
      change: previousPeriod ? getChange(qualityMetrics.passRate, previousPeriod.passRate) : "+1.8%",
      changeType: getChangeType(qualityMetrics.passRate, 98),
      icon: CheckCircle2,
      target: "98%"
    },
    {
      title: "Defect Rate",
      value: `${qualityMetrics.defectRate}%`,
      change: previousPeriod ? getChange(qualityMetrics.defectRate, (100 - previousPeriod.passRate)) : "-1.2%",
      changeType: qualityMetrics.defectRate <= 2 ? "positive" : "negative",
      icon: XCircle,
      target: "<2%"
    },
    {
      title: "Critical Issues",
      value: qualityMetrics.criticalIssues.toString(),
      change: "-2",
      changeType: qualityMetrics.criticalIssues === 0 ? "positive" : "negative",
      icon: AlertTriangle,
      target: "0"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quality Metrics</h1>
          <p className="text-muted-foreground">
            Monitor quality performance and trends • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button variant="outline" onClick={recalculateMetrics} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {metric.title}
                  </p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">
                      {metric.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Target: {metric.target}
                    </p>
                    <div className="flex items-center gap-1">
                      {metric.changeType === "positive" ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      <span className={`text-xs font-medium ${
                        metric.changeType === "positive" ? "text-success" : "text-destructive"
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Quality Trends</TabsTrigger>
          <TabsTrigger value="defects">Defect Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quality Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={qualityMetrics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pass Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={qualityMetrics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="passRate" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="defects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Defect Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={qualityMetrics.defectTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {qualityMetrics.defectTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Defects</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={qualityMetrics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="defects" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Quality Targets Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Quality Score</span>
                    <span>{qualityMetrics.overallScore}% / 95%</span>
                  </div>
                  <Progress value={(qualityMetrics.overallScore / 95) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pass Rate</span>
                    <span>{qualityMetrics.passRate}% / 98%</span>
                  </div>
                  <Progress value={(qualityMetrics.passRate / 98) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Defect Reduction</span>
                    <span>{qualityMetrics.defectRate}% / 2%</span>
                  </div>
                  <Progress value={Math.max(0, (2 - qualityMetrics.defectRate) / 2 * 100)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}