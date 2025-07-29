import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

interface Inspection {
  id: string;
  productName: string;
  inspector: string;
  status: "passed" | "failed" | "pending";
  score: number;
  date: string;
  issues: number;
}

const inspections: Inspection[] = [
  {
    id: "INS-001",
    productName: "Electronic Component A1",
    inspector: "John Smith",
    status: "passed",
    score: 96,
    date: "2024-01-15",
    issues: 0
  },
  {
    id: "INS-002",
    productName: "Mechanical Part B2",
    inspector: "Sarah Johnson",
    status: "failed",
    score: 72,
    date: "2024-01-15",
    issues: 3
  },
  {
    id: "INS-003",
    productName: "Circuit Board C3",
    inspector: "Mike Davis",
    status: "pending",
    score: 0,
    date: "2024-01-15",
    issues: 0
  },
  {
    id: "INS-004",
    productName: "Housing Unit D4",
    inspector: "Emily Wilson",
    status: "passed",
    score: 94,
    date: "2024-01-14",
    issues: 1
  }
];

export function RecentInspections() {
  const getStatusBadge = (status: Inspection["status"]) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-success/10 text-success border-success/20">Passed</Badge>;
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Inspections</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inspections.map((inspection) => (
            <div 
              key={inspection.id} 
              className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-sm">{inspection.productName}</h4>
                  {getStatusBadge(inspection.status)}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>ID: {inspection.id}</span>
                  <span>Inspector: {inspection.inspector}</span>
                  <span>Date: {inspection.date}</span>
                  {inspection.status !== "pending" && (
                    <span>Score: {inspection.score}%</span>
                  )}
                  {inspection.issues > 0 && (
                    <span className="text-destructive">Issues: {inspection.issues}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}