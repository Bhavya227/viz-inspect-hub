import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAppStore } from "@/lib/store";

export function QualityChart() {
  const { qualityMetrics } = useAppStore();
  
  const qualityData = qualityMetrics.monthlyTrends.length > 0 
    ? qualityMetrics.monthlyTrends 
    : [{ month: "Current", score: 0, defects: 0, inspections: 0 }];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Quality Score Trends
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
              name="Quality Score (%)"
            />
            <Line 
              type="monotone" 
              dataKey="defects" 
              stroke="hsl(var(--chart-4))" 
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 3 }}
              name="Defects Found"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}