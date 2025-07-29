import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  Scan, 
  Save, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  Play,
  Pause
} from "lucide-react";
import { toast } from "sonner";

export default function VisualInspect() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    defects: Array<{
      type: string;
      severity: "low" | "medium" | "high";
      location: { x: number; y: number };
      confidence: number;
    }>;
    overallScore: number;
    status: "pass" | "fail" | "review";
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock analysis function
  const performAnalysis = () => {
    setIsScanning(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const mockResults = {
        defects: [
          {
            type: "Surface Scratch",
            severity: "medium" as const,
            location: { x: 45, y: 30 },
            confidence: 87
          },
          {
            type: "Color Variation",
            severity: "low" as const,
            location: { x: 70, y: 60 },
            confidence: 92
          }
        ],
        overallScore: 84,
        status: "review" as const
      };
      
      setAnalysisResults(mockResults);
      setIsScanning(false);
      toast.success("Analysis completed!");
    }, 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Camera access denied");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      if (context) {
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        
        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "bg-success text-success-foreground";
      case "fail": return "bg-destructive text-destructive-foreground";
      case "review": return "bg-warning text-warning-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visual Inspection</h1>
          <p className="text-muted-foreground">AI-powered visual quality analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <Button variant="outline" onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Use Camera
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Analysis Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Image Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedImage && !videoRef.current?.srcObject && (
              <div className="aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-accent/20">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Upload an image or use camera to start analysis</p>
                </div>
              </div>
            )}

            {videoRef.current?.srcObject && !selectedImage && (
              <div className="space-y-4">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full aspect-video rounded-lg border"
                />
                <Button onClick={capturePhoto} className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>
              </div>
            )}

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Inspection target" 
                    className="w-full aspect-video object-cover rounded-lg border"
                  />
                  
                  {/* Defect Markers */}
                  {analysisResults?.defects.map((defect, index) => (
                    <div
                      key={index}
                      className="absolute w-4 h-4 border-2 border-destructive bg-destructive/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        left: `${defect.location.x}%`, 
                        top: `${defect.location.y}%` 
                      }}
                      title={`${defect.type} (${defect.confidence}% confidence)`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={performAnalysis} 
                    disabled={isScanning}
                    className="flex-1 bg-gradient-primary hover:bg-primary-hover"
                  >
                    {isScanning ? (
                      <>
                        <Scan className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-4 w-4" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Analysis Results */}
          {analysisResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Analysis Results
                  <Badge className={getStatusColor(analysisResults.status)}>
                    {analysisResults.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-accent/20">
                  <p className="text-sm text-muted-foreground">Overall Quality Score</p>
                  <p className="text-3xl font-bold text-primary">{analysisResults.overallScore}%</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Detected Issues</h4>
                  {analysisResults.defects.length > 0 ? (
                    analysisResults.defects.map((defect, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{defect.type}</p>
                          <p className="text-sm text-muted-foreground">
                            Location: {defect.location.x}%, {defect.location.y}%
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge className={getSeverityColor(defect.severity)}>
                            {defect.severity}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {defect.confidence}% confidence
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No defects detected
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Save Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Inspection Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-accent/20">
                  <p className="text-sm text-muted-foreground">Today's Scans</p>
                  <p className="text-xl font-bold">47</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/20">
                  <p className="text-sm text-muted-foreground">Avg. Score</p>
                  <p className="text-xl font-bold">94.2%</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/20">
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <p className="text-xl font-bold">91%</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/20">
                  <p className="text-sm text-muted-foreground">Issues Found</p>
                  <p className="text-xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Upload an image or use camera to capture the product</p>
                <p>2. Click "Start Analysis" to begin AI inspection</p>
                <p>3. Review detected defects and quality score</p>
                <p>4. Save or export the inspection report</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}