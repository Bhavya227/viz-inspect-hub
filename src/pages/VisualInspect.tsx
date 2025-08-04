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
import * as tf from '@tensorflow/tfjs';
import { useAppStore, Inspection } from "@/lib/store";

export default function VisualInspect() {
  const { addInspection } = useAppStore();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    defects: Array<{
      type: string;
      category: "scratch" | "crack" | "contamination" | "color" | "imprint" | "other";
      severity: "low" | "medium" | "high";
      location: { x: number; y: number };
      confidence: number;
    }>;
    overallScore: number;
    status: "pass" | "fail" | "review";
    detectionResults: Array<{
      label: string;
      confidence: number;
    }>;
  } | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [modelLabels, setModelLabels] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize Teachable Machine model
  useEffect(() => {
    const initializeModel = async () => {
      try {
        const modelURL = 'https://teachablemachine.withgoogle.com/models/wwG4ipELH/model.json';
        const metadataURL = 'https://teachablemachine.withgoogle.com/models/wwG4ipELH/metadata.json';
        
        // Load the model and metadata
        const loadedModel = await tf.loadLayersModel(modelURL);
        const response = await fetch(metadataURL);
        const metadata = await response.json();
        
        setModel(loadedModel);
        setModelLabels(metadata.labels);
        toast.success("AI model loaded successfully!");
      } catch (error) {
        console.error("Failed to load model:", error);
        toast.error("Failed to load AI model. Please try again.");
      }
    };
    
    initializeModel();
  }, []);

  // Real AI analysis using Teachable Machine model
  const performAnalysis = async () => {
    if (!selectedImage || !model || !modelLabels.length) {
      toast.error("Please upload an image and wait for model to load");
      return;
    }

    setIsScanning(true);
    
    try {
      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = selectedImage;
      });

      // Preprocess image for the model (224x224 is standard for most models)
      const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .expandDims(0)
        .div(255.0);

      // Run prediction
      const predictions = await model.predict(tensor) as tf.Tensor;
      const scores = await predictions.data();
      
      // Clean up tensors
      tensor.dispose();
      predictions.dispose();

      // Process results
      const results = modelLabels.map((label, index) => ({
        label,
        score: scores[index],
        confidence: Math.round(scores[index] * 100)
      })).sort((a, b) => b.score - a.score);

      // Categorize defects based on model labels
      const categorizeDefect = (label: string) => {
        const labelLower = label.toLowerCase();
        if (labelLower.includes('scratch')) return 'scratch';
        if (labelLower.includes('crack')) return 'crack';
        if (labelLower.includes('contamination')) return 'contamination';
        if (labelLower.includes('color')) return 'color';
        if (labelLower.includes('imprint')) return 'imprint';
        return 'other';
      };

      // Analyze results for pill quality
      const defects = [];
      let overallScore = 100;
      let status: "pass" | "fail" | "review" = "pass";
      
      // Check all results with significant confidence
      for (const result of results) {
        const confidence = result.confidence;
        const labelLower = result.label.toLowerCase();
        
        if (confidence > 30 && !labelLower.includes('good') && !labelLower.includes('pill type')) {
          const severity = confidence > 70 ? "high" : confidence > 40 ? "medium" : "low";
          const category = categorizeDefect(result.label);
          
          defects.push({
            type: result.label,
            category,
            severity: severity as "low" | "medium" | "high",
            location: { 
              x: Math.random() * 80 + 10, 
              y: Math.random() * 80 + 10 
            },
            confidence: confidence
          });
        }
      }
      
      // Calculate overall score based on defects
      if (defects.length > 0) {
        const highSeverityDefects = defects.filter(d => d.severity === "high").length;
        const mediumSeverityDefects = defects.filter(d => d.severity === "medium").length;
        
        if (highSeverityDefects > 0) {
          overallScore = Math.max(20, 100 - (highSeverityDefects * 40) - (mediumSeverityDefects * 20));
          status = "fail";
        } else if (mediumSeverityDefects > 0) {
          overallScore = Math.max(50, 100 - (mediumSeverityDefects * 25));
          status = "review";
        } else {
          overallScore = Math.max(70, 100 - (defects.length * 15));
          status = "review";
        }
      } else {
        // Check if "Good" was detected with high confidence
        const goodResult = results.find(r => r.label.toLowerCase().includes('good'));
        if (goodResult && goodResult.confidence > 60) {
          overallScore = Math.min(95, 70 + goodResult.confidence / 3);
          status = "pass";
        } else {
          overallScore = 85;
          status = "pass";
        }
      }
      
      setAnalysisResults({
        defects,
        overallScore: Math.round(overallScore),
        status,
        detectionResults: results.slice(0, 5) // Top 5 results
      });
      
      const primaryResult = results[0];
      toast.success(`Analysis completed! Primary detection: ${primaryResult.label} (${primaryResult.confidence}% confidence)`);
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      setIsScanning(false);
    }
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
        setAnalysisResults(null);
        
        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        toast.success("Photo captured! Ready for analysis.");
      }
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => direction === 'in' ? Math.min(prev + 0.2, 3) : Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const saveReport = () => {
    if (!analysisResults) {
      toast.error("No analysis results to save");
      return;
    }
    
    // Create inspection record for global store
    const inspection: Inspection = {
      id: `INS-${Date.now()}`,
      productName: "Quality Inspection Sample",
      batchNumber: `BATCH-${Date.now().toString().slice(-4)}`,
      inspector: "Rajesh Kumar", // Current user
      status: analysisResults.status === "pass" ? "passed" : analysisResults.status === "fail" ? "failed" : "pending",
      score: analysisResults.overallScore,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      issues: analysisResults.defects.length,
      location: "Manufacturing Unit - Bangalore",
      defects: analysisResults.defects
    };
    
    // Add to global store
    addInspection(inspection);
    
    const report = {
      timestamp: new Date().toISOString(),
      image: selectedImage,
      results: analysisResults,
      inspection
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `inspection-report-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Inspection saved and synced to dashboard!");
  };

  const exportReport = () => {
    if (!analysisResults || !selectedImage) {
      toast.error("No analysis results to export");
      return;
    }
    
    // Create a simple text report
    const reportText = `
QUALITY INSPECTION REPORT
========================
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

OVERALL SCORE: ${analysisResults.overallScore}%
STATUS: ${analysisResults.status.toUpperCase()}

DETECTED ISSUES:
${analysisResults.defects.length === 0 ? 'None' : 
  analysisResults.defects.map(defect => 
    `- ${defect.type} (${defect.severity} severity, ${defect.confidence}% confidence)`
  ).join('\n')}

Generated by AI Quality Inspection System
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', `inspection-report-${Date.now()}.txt`);
    linkElement.click();
    
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully!");
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
                 <div className="relative overflow-hidden rounded-lg border">
                   <img 
                     src={selectedImage} 
                     alt="Inspection target" 
                     className="w-full aspect-video object-cover transition-transform duration-200"
                     style={{ 
                       transform: `scale(${zoom}) rotate(${rotation}deg)`,
                       transformOrigin: 'center'
                     }}
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
                   <Button variant="outline" size="icon" onClick={() => handleZoom('in')}>
                     <ZoomIn className="h-4 w-4" />
                   </Button>
                   <Button variant="outline" size="icon" onClick={() => handleZoom('out')}>
                     <ZoomOut className="h-4 w-4" />
                   </Button>
                   <Button variant="outline" size="icon" onClick={handleRotate}>
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

                {/* Defect Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium">Anomaly Categories</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['scratch', 'crack', 'contamination', 'color', 'imprint', 'other'].map(category => {
                      const categoryDefects = analysisResults.defects.filter(d => d.category === category);
                      const count = categoryDefects.length;
                      const hasIssues = count > 0;
                      
                      return (
                        <div key={category} className={`p-3 rounded-lg border ${hasIssues ? 'border-destructive/50 bg-destructive/10' : 'border-success/50 bg-success/10'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{category}</span>
                            <Badge variant={hasIssues ? "destructive" : "default"} className="text-xs">
                              {hasIssues ? `${count} found` : 'OK'}
                            </Badge>
                          </div>
                          {hasIssues && (
                            <div className="mt-2 space-y-1">
                              {categoryDefects.map((defect, idx) => (
                                <div key={idx} className="text-xs text-muted-foreground">
                                  {defect.type} ({defect.confidence}%)
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Detection Results</h4>
                  {analysisResults.detectionResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded border-l-4 border-l-primary/30">
                      <span className="text-sm">{result.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.confidence}%
                      </Badge>
                    </div>
                  ))}
                </div>

                 <div className="flex gap-2">
                   <Button variant="outline" className="flex-1" onClick={saveReport}>
                     <Save className="mr-2 h-4 w-4" />
                     Save Report
                   </Button>
                   <Button variant="outline" className="flex-1" onClick={exportReport}>
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