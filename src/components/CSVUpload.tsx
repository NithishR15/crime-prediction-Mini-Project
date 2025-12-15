import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, X, Loader2, Download, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionResult {
  location: string;
  time_of_day: string;
  day_of_week: string;
  predicted_crime_type: string;
  risk_level: string;
  probability: number;
  confidence: number;
}

const CRIME_TYPES = ["Theft", "Robbery", "Assault", "Burglary", "Fraud", "Vandalism"];
const RISK_LEVELS = ["Low", "Medium", "High", "Critical"];

export function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/csv" || droppedFile?.name.endsWith(".csv")) {
      setFile(droppedFile);
      setPredictions([]);
      setSaved(false);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPredictions([]);
      setSaved(false);
    }
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
    
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim().replace(/"/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || "";
      });
      return row;
    });
  };

  const simulatePrediction = (row: Record<string, string>): PredictionResult => {
    // Simulate ML prediction based on input features
    const location = row.location || row.area || "Unknown";
    const timeOfDay = row.time_of_day || row.time || "Day";
    const dayOfWeek = row.day_of_week || row.day || "Monday";
    
    // Simple hash-based prediction simulation
    const hash = (location + timeOfDay + dayOfWeek).split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    
    const crimeType = CRIME_TYPES[hash % CRIME_TYPES.length];
    const riskIndex = (hash % 4);
    const probability = 0.45 + (hash % 50) / 100;
    const confidence = 0.7 + (hash % 25) / 100;
    
    return {
      location,
      time_of_day: timeOfDay,
      day_of_week: dayOfWeek,
      predicted_crime_type: crimeType,
      risk_level: RISK_LEVELS[riskIndex],
      probability: Math.min(probability, 0.95),
      confidence: Math.min(confidence, 0.95),
    };
  };

  const processCSV = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length === 0) {
        toast({
          title: "Empty File",
          description: "The CSV file appears to be empty or invalid.",
          variant: "destructive",
        });
        return;
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const results = rows.map(row => simulatePrediction(row));
      setPredictions(results);
      
      toast({
        title: "Predictions Complete!",
        description: `Generated ${results.length} predictions from your data.`,
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Failed to process the CSV file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const savePredictions = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save your predictions.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const insertData = predictions.map(p => ({
        location: p.location,
        time_of_day: p.time_of_day,
        day_of_week: p.day_of_week,
        predicted_crime_type: p.predicted_crime_type,
        risk_level: p.risk_level,
        probability: p.probability,
        confidence: p.confidence,
      }));

      const { error } = await supabase.from("prediction_logs").insert(insertData);
      
      if (error) throw error;
      
      setSaved(true);
      toast({
        title: "Saved Successfully!",
        description: `${predictions.length} predictions saved to your history.`,
      });
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save predictions.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadResults = () => {
    if (predictions.length === 0) return;
    
    const headers = ["Location", "Time of Day", "Day of Week", "Predicted Crime", "Risk Level", "Probability", "Confidence"];
    const csvContent = [
      headers.join(","),
      ...predictions.map(p => 
        [p.location, p.time_of_day, p.day_of_week, p.predicted_crime_type, p.risk_level, p.probability.toFixed(2), p.confidence.toFixed(2)].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "predictions_result.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical": return "text-red-500 bg-red-500/10";
      case "High": return "text-orange-500 bg-orange-500/10";
      case "Medium": return "text-yellow-500 bg-yellow-500/10";
      default: return "text-green-500 bg-green-500/10";
    }
  };

  const clearFile = () => {
    setFile(null);
    setPredictions([]);
    setSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-primary/10 p-2">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Upload CSV for Batch Predictions</h3>
          <p className="text-sm text-muted-foreground">Upload your data file to get crime predictions</p>
        </div>
      </div>

      {/* File Drop Zone */}
      {!file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          )}
        >
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">Drop your CSV file here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <p className="text-xs text-muted-foreground">
            Required columns: location, time_of_day, day_of_week
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Selected File */}
      {file && !predictions.length && (
        <div className="border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={processCSV} disabled={isProcessing} variant="glow">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Predict
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {predictions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium text-foreground">{predictions.length} Predictions Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadResults}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              {user ? (
                <Button
                  variant="glow"
                  size="sm"
                  onClick={savePredictions}
                  disabled={isSaving || saved}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : saved ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saved ? "Saved" : "Save to History"}
                </Button>
              ) : (
                <Button variant="secondary" size="sm" disabled>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Login to Save
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Location</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Time</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Day</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Predicted Crime</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Risk</th>
                    <th className="text-right px-4 py-3 font-medium text-foreground">Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {predictions.map((p, i) => (
                    <tr key={i} className="hover:bg-secondary/30">
                      <td className="px-4 py-3 text-foreground">{p.location}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.time_of_day}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.day_of_week}</td>
                      <td className="px-4 py-3 text-foreground font-medium">{p.predicted_crime_type}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getRiskColor(p.risk_level))}>
                          {p.risk_level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        {(p.probability * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
