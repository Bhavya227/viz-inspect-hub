import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const qualityData = [
  { month: "Jan", score: 92, defects: 8, inspections: 156 },
  { month: "Feb", score: 94, defects: 6, inspections: 142 },
  { month: "Mar", score: 89, defects: 11, inspections: 178 },
  { month: "Apr", score: 96, defects: 4, inspections: 165 },
  { month: "May", score: 91, defects: 9, inspections: 189 },
  { month: "Jun", score: 98, defects: 2, inspections: 201 },
];

export function QualityChart() {
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