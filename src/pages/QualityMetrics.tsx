import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Target, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const qualityTrends = [
  { month: "Jan", score: 85, defects: 12, passRate: 88 },
  { month: "Feb", score: 87, defects: 10, passRate: 90 },
  { month: "Mar", score: 89, defects: 8, passRate: 92 },
  { month: "Apr", score: 91, defects: 6, passRate: 94 },
  { month: "May", score: 88, defects: 9, passRate: 91 },
  { month: "Jun", score: 92, defects: 5, passRate: 95 }
];

const defectTypes = [
  { name: "Scratch", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Crack", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Contamination", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Color", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" }
];

const metrics = [
  {
    title: "Overall Quality Score",
    value: "92%",
    change: "+3.2%",
    changeType: "positive" as const,
    icon: Target,
    target: "95%"
  },
  {
    title: "Pass Rate",
    value: "95.2%",
    change: "+1.8%",
    changeType: "positive" as const,
    icon: CheckCircle2,
    target: "98%"
  },
  {
    title: "Defect Rate",
    value: "4.8%",
    change: "-1.2%",
    changeType: "positive" as const,
    icon: XCircle,
    target: "<2%"
  },
  {
    title: "Critical Issues",
    value: "3",
    change: "-2",
    changeType: "positive" as const,
    icon: AlertTriangle,
    target: "0"
  }
];

export default function QualityMetrics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quality Metrics</h1>
          <p className="text-muted-foreground">Monitor quality performance and trends</p>
        </div>
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
                  <LineChart data={qualityTrends}>
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
                  <BarChart data={qualityTrends}>
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
                      data={defectTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {defectTypes.map((entry, index) => (
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
                  <BarChart data={qualityTrends}>
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
                    <span>92% / 95%</span>
                  </div>
                  <Progress value={96.8} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pass Rate</span>
                    <span>95.2% / 98%</span>
                  </div>
                  <Progress value={97.1} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Defect Reduction</span>
                    <span>4.8% / 2%</span>
                  </div>
                  <Progress value={58.3} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}