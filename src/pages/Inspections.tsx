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
  FileText
} from "lucide-react";

const inspections = [
  {
    id: "INS-001",
    productName: "Electronic Component A1",
    batchNumber: "BATCH-2024-001",
    inspector: "John Smith",
    status: "passed" as const,
    score: 96,
    date: "2024-01-15",
    time: "14:30",
    issues: 0,
    location: "Station A"
  },
  {
    id: "INS-002",
    productName: "Mechanical Part B2",
    batchNumber: "BATCH-2024-002",
    inspector: "Sarah Johnson",
    status: "failed" as const,
    score: 72,
    date: "2024-01-15",
    time: "13:15",
    issues: 3,
    location: "Station B"
  },
  {
    id: "INS-003",
    productName: "Circuit Board C3",
    batchNumber: "BATCH-2024-003",
    inspector: "Mike Davis",
    status: "pending" as const,
    score: 0,
    date: "2024-01-15",
    time: "15:45",
    issues: 0,
    location: "Station C"
  }
];

export default function Inspections() {
  const [searchTerm, setSearchTerm] = useState("");

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
        <Button className="bg-gradient-primary hover:bg-primary-hover">
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
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inspections List */}
      <div className="space-y-4">
        {inspections.map((inspection) => (
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
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}