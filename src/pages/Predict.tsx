import { Header } from "@/components/Header";
import { PredictionPanel } from "@/components/PredictionPanel";
import { HeatmapGrid } from "@/components/HeatmapGrid";
import { CSVUpload } from "@/components/CSVUpload";
import { useCrimeIncidents, getCrimeStats } from "@/hooks/useCrimeData";
import { Brain, Cpu, GitBranch, Target, Zap, BarChart3, Loader2 } from "lucide-react";

const modelSteps = [
  {
    icon: Cpu,
    title: "1. Data Collection",
    description: "Gather historical crime data with features like location, time, and crime type.",
  },
  {
    icon: GitBranch,
    title: "2. Preprocessing",
    description: "Clean data, handle missing values, encode categorical variables.",
  },
  {
    icon: Brain,
    title: "3. Feature Engineering",
    description: "Extract meaningful features: hour of day, day of week, distance from hotspots.",
  },
  {
    icon: Target,
    title: "4. Model Training",
    description: "Train Decision Tree or Random Forest classifier on labeled data.",
  },
  {
    icon: BarChart3,
    title: "5. Evaluation",
    description: "Test accuracy using cross-validation, precision, recall, F1-score.",
  },
  {
    icon: Zap,
    title: "6. Prediction",
    description: "Deploy model to predict crime likelihood for new inputs.",
  },
];

export default function Predict() {
  const { data: crimeData, isLoading } = useCrimeIncidents();
  const stats = crimeData ? getCrimeStats(crimeData) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Crime Prediction Engine</h1>
          <p className="mt-1 text-muted-foreground">
            Use the trained ML model to predict crime likelihood based on location and time
          </p>
        </div>

        {/* ML Pipeline Steps */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">ML Pipeline Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modelSteps.map((step, index) => (
              <div
                key={step.title}
                className="animate-fade-in rounded-xl border border-border bg-card p-5 opacity-0 transition-all hover:border-primary/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Panel */}
        <div className="mb-8">
          <PredictionPanel />
        </div>

        {/* CSV Upload for Batch Predictions */}
        <div className="mb-8">
          <CSVUpload />
        </div>

        {/* Hotspot Reference */}
        {isLoading ? (
          <div className="mb-8 flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading location data...</p>
          </div>
        ) : (
          stats && (
            <div className="mb-8">
              <HeatmapGrid data={stats.locationCount} />
            </div>
          )
        )}

        {/* Model Info */}
        <div
          className="mb-12 animate-fade-in rounded-xl border border-border bg-card p-6 opacity-0"
          style={{ animationDelay: "800ms" }}
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">About the Prediction Model</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-foreground">Algorithm Used</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Decision Tree Classifier</strong> - A supervised learning algorithm that
                creates a model predicting target values by learning decision rules from features.
                Easy to interpret and visualize.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-foreground">Features Used</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • <span className="text-foreground">Location</span> - Encoded area ID
                </li>
                <li>
                  • <span className="text-foreground">Time of Day</span> -
                  Morning/Afternoon/Evening/Night
                </li>
                <li>
                  • <span className="text-foreground">Day of Week</span> - Weekday vs Weekend
                  patterns
                </li>
                <li>
                  • <span className="text-foreground">Historical Frequency</span> - Past incidents in
                  area
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
