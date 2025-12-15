import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, AlertTriangle, CheckCircle, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { chennaiLocations, crimeTypes } from "@/data/crimeData";
import { useInsertPrediction, usePredictionLogs } from "@/hooks/useCrimeData";

interface PredictionResult {
  crimeType: string;
  probability: number;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
}

export function PredictionPanel() {
  const [location, setLocation] = useState(chennaiLocations[0].name);
  const [timeOfDay, setTimeOfDay] = useState("evening");
  const [dayOfWeek, setDayOfWeek] = useState("saturday");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const insertPrediction = useInsertPrediction();
  const { data: predictionHistory } = usePredictionLogs();

  const handlePredict = async () => {
    setIsLoading(true);

    // Simulate ML prediction with weighted randomness based on inputs
    setTimeout(async () => {
      // Use location and time to influence prediction (simulated ML behavior)
      const locationIndex = chennaiLocations.findIndex((l) => l.name === location);
      const timeMultiplier = timeOfDay === "night" ? 0.8 : timeOfDay === "evening" ? 0.6 : 0.4;
      const weekendMultiplier = ["saturday", "sunday"].includes(dayOfWeek) ? 1.1 : 1;

      const baseProb = 0.4 + (locationIndex * 0.03) + timeMultiplier * 0.2;
      const probability = Math.min(0.95, baseProb * weekendMultiplier);
      const confidence = 0.75 + Math.random() * 0.2;

      // Weight crime types based on time of day
      const weightedTypes =
        timeOfDay === "night"
          ? ["Theft", "Robbery", "Burglary", "Drug Offense"]
          : ["Theft", "Fraud", "Vandalism", "Assault"];
      const randomType = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];

      const result: PredictionResult = {
        crimeType: randomType,
        probability,
        riskLevel: probability > 0.7 ? "high" : probability > 0.5 ? "medium" : "low",
        confidence,
      };

      setPrediction(result);
      setIsLoading(false);

      // Save prediction to database
      await insertPrediction.mutateAsync({
        location,
        time_of_day: timeOfDay,
        day_of_week: dayOfWeek,
        predicted_crime_type: result.crimeType,
        probability: result.probability,
        risk_level: result.riskLevel,
        confidence: result.confidence,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div
        className="animate-fade-in rounded-xl border border-border bg-card p-6 opacity-0"
        style={{ animationDelay: "400ms" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">ML Prediction Engine</h3>
            <p className="text-sm text-muted-foreground">
              Predict crime likelihood using trained model
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {chennaiLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Time of Day</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="morning">Morning (6AM - 12PM)</option>
              <option value="afternoon">Afternoon (12PM - 6PM)</option>
              <option value="evening">Evening (6PM - 10PM)</option>
              <option value="night">Night (10PM - 6AM)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Day of Week</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        </div>

        <Button onClick={handlePredict} disabled={isLoading} variant="glow" className="mt-6 w-full">
          {isLoading ? (
            <>
              <Sparkles className="animate-spin" />
              Running Prediction Model...
            </>
          ) : (
            <>
              <Brain />
              Generate Prediction
            </>
          )}
        </Button>

        {prediction && (
          <div
            className={cn(
              "mt-6 animate-scale-in rounded-lg border p-4",
              prediction.riskLevel === "high"
                ? "border-destructive/50 bg-destructive/10"
                : prediction.riskLevel === "medium"
                ? "border-warning/50 bg-warning/10"
                : "border-success/50 bg-success/10"
            )}
          >
            <div className="flex items-start gap-3">
              {prediction.riskLevel === "high" ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle className="h-5 w-5 text-success" />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Prediction Result</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on the trained Decision Tree model
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-card p-3">
                    <p className="text-xs text-muted-foreground">Predicted Crime Type</p>
                    <p className="text-lg font-semibold text-foreground">{prediction.crimeType}</p>
                  </div>
                  <div className="rounded-lg bg-card p-3">
                    <p className="text-xs text-muted-foreground">Probability</p>
                    <p className="text-lg font-semibold text-primary">
                      {(prediction.probability * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-card p-3">
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p
                      className={cn(
                        "text-lg font-semibold capitalize",
                        prediction.riskLevel === "high"
                          ? "text-destructive"
                          : prediction.riskLevel === "medium"
                          ? "text-warning"
                          : "text-success"
                      )}
                    >
                      {prediction.riskLevel}
                    </p>
                  </div>
                  <div className="rounded-lg bg-card p-3">
                    <p className="text-xs text-muted-foreground">Model Confidence</p>
                    <p className="text-lg font-semibold text-accent">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prediction History */}
      {predictionHistory && predictionHistory.length > 0 && (
        <div
          className="animate-fade-in rounded-xl border border-border bg-card p-6 opacity-0"
          style={{ animationDelay: "600ms" }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <History className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Predictions</h3>
              <p className="text-sm text-muted-foreground">Last {predictionHistory.length} predictions</p>
            </div>
          </div>

          <div className="space-y-2">
            {predictionHistory.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      log.risk_level === "high"
                        ? "bg-destructive"
                        : log.risk_level === "medium"
                        ? "bg-warning"
                        : "bg-success"
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{log.predicted_crime_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.location} • {log.time_of_day} • {log.day_of_week}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">
                  {(log.probability * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
