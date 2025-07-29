import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Download,
  Calendar,
  Target,
  AlertCircle
} from "lucide-react";

const monthlyData = [
  { month: "Jan", inspections: 156, passed: 148, failed: 8, score: 92 },
  { month: "Feb", inspections: 142, passed: 136, failed: 6, score: 94 },
  { month: "Mar", inspections: 178, passed: 167, failed: 11, score: 89 },
  { month: "Apr", inspections: 165, passed: 161, failed: 4, score: 96 },
  { month: "May", inspections: 189, passed: 180, failed: 9, score: 91 },
  { month: "Jun", inspections: 201, passed: 197, failed: 4, score: 98 },
];

const defectTrends = [
  { week: "Week 1", scratches: 12, dimensional: 8, color: 5, assembly: 3 },
  { week: "Week 2", scratches: 15, dimensional: 6, color: 7, assembly: 2 },
  { week: "Week 3", scratches: 9, dimensional: 10, color: 4, assembly: 5 },
  { week: "Week 4", scratches: 7, dimensional: 5, color: 3, assembly: 1 },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">Deep dive into quality trends and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 6 Months
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quality Improvement</p>
                <p className="text-2xl font-bold text-success">+6.5%</p>
                <p className="text-xs text-muted-foreground">vs last quarter</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Gain</p>
                <p className="text-2xl font-bold text-primary">+15%</p>
                <p className="text-xs text-muted-foreground">inspection speed</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Defect Reduction</p>
                <p className="text-2xl font-bold text-warning">-28%</p>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </div>
              <TrendingDown className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-destructive">3</p>
                <p className="text-xs text-muted-foreground">require attention</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar dataKey="passed" stackId="a" fill="hsl(var(--chart-2))" name="Passed" />
              <Bar dataKey="failed" stackId="a" fill="hsl(var(--chart-4))" name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Defect Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Defect Category Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={defectTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="scratches" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} name="Surface Scratches" />
              <Area type="monotone" dataKey="dimensional" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} name="Dimensional" />
              <Area type="monotone" dataKey="color" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.6} name="Color Issues" />
              <Area type="monotone" dataKey="assembly" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.6} name="Assembly" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Inspectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", score: 98.5, inspections: 145 },
                { name: "Mike Davis", score: 96.8, inspections: 132 },
                { name: "John Smith", score: 95.2, inspections: 158 },
                { name: "Emily Wilson", score: 94.7, inspections: 124 }
              ].map((inspector, index) => (
                <div key={inspector.name} className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{inspector.name}</p>
                      <p className="text-sm text-muted-foreground">{inspector.inspections} inspections</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{inspector.score}%</p>
                    <p className="text-xs text-muted-foreground">avg. score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">High Defect Rate Detected</p>
                  <p className="text-sm text-muted-foreground">Station B showing 15% defect rate increase</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg border border-warning/20 bg-warning/5">
                <TrendingDown className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-warning">Quality Score Decline</p>
                  <p className="text-sm text-muted-foreground">Product Line C showing gradual decline</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Target Achievement</p>
                  <p className="text-sm text-muted-foreground">Monthly quality target exceeded by 3%</p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}