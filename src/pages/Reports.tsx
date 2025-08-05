import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export default function Reports() {
  const { inspections, qualityMetrics } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportType, setReportType] = useState("all");

  // Generate reports from inspection data
  const reports = inspections.map(inspection => ({
    id: inspection.id,
    title: `Quality Report - ${inspection.productName}`,
    type: "Quality Inspection",
    status: inspection.status,
    date: inspection.date,
    inspector: inspection.inspector,
    score: inspection.score,
    issues: inspection.issues,
    location: inspection.location,
    batchNumber: inspection.batchNumber
  }));

  // Add summary reports
  const summaryReports = [
    {
      id: "summary-monthly",
      title: "Monthly Quality Summary",
      type: "Summary Report",
      status: "completed",
      date: new Date().toLocaleDateString(),
      inspector: "System Generated",
      score: Math.round(qualityMetrics.overallScore),
      issues: qualityMetrics.criticalIssues,
      location: "All Locations",
      batchNumber: "All Batches"
    },
    {
      id: "defect-analysis",
      title: "Defect Analysis Report",
      type: "Analysis Report", 
      status: "completed",
      date: new Date().toLocaleDateString(),
      inspector: "System Generated",
      score: Math.round(qualityMetrics.defectRate),
      issues: qualityMetrics.criticalIssues,
      location: "All Locations",
      batchNumber: "All Batches"
    }
  ];

  const allReports = [...summaryReports, ...reports];

  // Filter reports
  const filteredReports = allReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesType = reportType === "all" || report.type.toLowerCase().includes(reportType.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDownload = (reportId: string) => {
    const report = allReports.find(r => r.id === reportId);
    if (report) {
      // Generate report content
      const reportContent = `
QUALITY INSPECTION REPORT
========================
Title: ${report.title}
Type: ${report.type}
Date: ${report.date}
Inspector: ${report.inspector}
Location: ${report.location}
Batch Number: ${report.batchNumber}
Quality Score: ${report.score}%
Issues Found: ${report.issues}
Status: ${report.status.toUpperCase()}

Generated on: ${new Date().toLocaleString()}
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Report downloaded: ${report.title}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Failed
        </Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Calendar className="mr-1 h-3 w-3" />
          Pending
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Summary") || type.includes("Analysis")) {
      return <BarChart3 className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-600">View and download quality inspection reports</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search reports..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="quality">Quality Inspection</SelectItem>
                <SelectItem value="summary">Summary Report</SelectItem>
                <SelectItem value="analysis">Analysis Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(report.type)}
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                      </div>
                      {getStatusBadge(report.status)}
                      {report.score !== undefined && (
                        <span className="text-sm font-medium text-blue-600">
                          Score: {report.score}%
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{report.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{report.date}</span>
                      </div>
                      <div>
                        <span>Inspector: {report.inspector}</span>
                      </div>
                      <div>
                        <span>Location: {report.location}</span>
                      </div>
                    </div>

                    {report.issues > 0 && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{report.issues} issue{report.issues > 1 ? 's' : ''} identified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(report.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
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
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No reports found</h3>
                  <p className="text-gray-600">
                    No reports match your current filter criteria
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}