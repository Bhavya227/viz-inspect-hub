import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Download,
  Calendar,
  User,
  FileText,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Dynamic data - will be populated when user performs inspections
const inspections: Array<{
  id: string;
  productName: string;
  batchNumber: string;
  inspector: string;
  status: "passed" | "failed" | "pending";
  score: number;
  date: string;
  time: string;
  issues: number;
  location: string;
}> = [];

export default function Inspections() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleNewInspection = () => {
    navigate('/visual-inspect');
  };

  const handleView = (inspectionId: string) => {
    toast.info(`Viewing inspection ${inspectionId}`);
  };

  const handleDownload = (inspectionId: string) => {
    toast.success(`Downloading report for inspection ${inspectionId}`);
  };

  const handleFilter = () => {
    toast.info("Filter functionality coming soon!");
  };

  const handleDateRange = () => {
    toast.info("Date range picker coming soon!");
  };

  const getStatusBadge = (status: "passed" | "failed" | "pending") => {
    switch (status) {
      case "passed":
        return <Badge className="bg-success/10 text-success border-success/20">Passed</Badge>;
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inspections</h1>
          <p className="text-muted-foreground">Manage and track quality inspections</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover" onClick={handleNewInspection}>
          <Plus className="mr-2 h-4 w-4" />
          New Inspection
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search inspections..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm" onClick={handleDateRange}>
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inspections List */}
      <div className="space-y-4">
        {inspections.length > 0 ? (
          inspections.map((inspection) => (
            <Card key={inspection.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-lg">{inspection.productName}</h3>
                      {getStatusBadge(inspection.status)}
                      {inspection.status !== "pending" && (
                        <span className="text-sm font-medium text-primary">
                          Score: {inspection.score}%
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>ID: {inspection.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{inspection.inspector}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{inspection.date} at {inspection.time}</span>
                      </div>
                      <div>
                        <span>Batch: {inspection.batchNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span>Location: {inspection.location}</span>
                      {inspection.issues > 0 && (
                        <span className="text-destructive font-medium">
                          {inspection.issues} issue{inspection.issues > 1 ? 's' : ''} found
                        </span>
                      )}
                    </div>
                  </div>

                   <div className="flex items-center gap-2">
                     <Button variant="outline" size="sm" onClick={() => handleView(inspection.id)}>
                       <Eye className="mr-2 h-4 w-4" />
                       View
                     </Button>
                     <Button variant="outline" size="sm" onClick={() => handleDownload(inspection.id)}>
                       <Download className="mr-2 h-4 w-4" />
                       Report
                     </Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No inspections yet</h3>
                  <p className="text-muted-foreground">
                    Start your first quality inspection to see data here
                  </p>
                </div>
                <Button className="bg-gradient-primary hover:bg-primary-hover" onClick={handleNewInspection}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Inspection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}