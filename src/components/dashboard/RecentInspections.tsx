import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Inspection {
  id: string;
  productName: string;
  inspector: string;
  status: "passed" | "failed" | "pending";
  score: number;
  date: string;
  issues: number;
}

// Dynamic data - will be populated when user performs inspections
const inspections: Inspection[] = [];

export function RecentInspections() {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/inspections');
  };

  const handleView = (inspectionId: string) => {
    toast.info(`Viewing inspection ${inspectionId}`);
    // In a real app, this would navigate to inspection details
  };

  const handleDownload = (inspectionId: string) => {
    toast.success(`Downloading report for inspection ${inspectionId}`);
    // In a real app, this would download the inspection report
  };

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
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inspections.length > 0 ? (
            inspections.map((inspection) => (
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
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(inspection.id)}>
                     <Eye className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(inspection.id)}>
                     <Download className="h-4 w-4" />
                   </Button>
                 </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No inspections yet</p>
              <p className="text-sm mt-1">Start performing quality inspections to see data here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}