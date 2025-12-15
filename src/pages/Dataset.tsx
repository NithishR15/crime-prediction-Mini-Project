import { Header } from "@/components/Header";
import { DataTable } from "@/components/DataTable";
import { CrimeChart } from "@/components/CrimeChart";
import { useCrimeIncidents, getCrimeStats, CrimeIncident } from "@/hooks/useCrimeData";
import { crimeTypes, chennaiLocations } from "@/data/crimeData";
import { Database, Download, FileSpreadsheet, Code, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dataset() {
  const { data: crimeData, isLoading, error } = useCrimeIncidents();
  const stats = crimeData ? getCrimeStats(crimeData) : null;

  const handleExport = () => {
    if (!crimeData) return;

    const csvContent = [
      [
        "ID",
        "Incident ID",
        "Date",
        "Time",
        "Crime Type",
        "Location",
        "Latitude",
        "Longitude",
        "Severity",
        "Status",
      ].join(","),
      ...crimeData.map((record) =>
        [
          record.id,
          record.incident_id,
          record.incident_date,
          record.incident_time,
          record.crime_type,
          record.location,
          record.latitude,
          record.longitude,
          record.severity,
          record.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crime_dataset.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">Crime Dataset Explorer</h1>
            <p className="mt-1 text-muted-foreground">
              Explore, analyze, and export the Chennai crime dataset for ML training
            </p>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={!crimeData}
            className="animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading crime data from database...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-destructive" />
            <p className="text-destructive">Failed to load crime data. Please try again later.</p>
          </div>
        )}

        {crimeData && stats && (
          <>
            {/* Dataset Info Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div
                className="animate-fade-in rounded-xl border border-border bg-card p-6"
                style={{ animationDelay: "150ms" }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Dataset Structure</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <span className="text-foreground">{crimeData.length}</span> total records
                  </li>
                  <li>
                    • <span className="text-foreground">10</span> feature columns
                  </li>
                  <li>
                    • <span className="text-foreground">{crimeTypes.length}</span> crime categories
                  </li>
                  <li>
                    • <span className="text-foreground">{chennaiLocations.length}</span> location zones
                  </li>
                </ul>
              </div>

              <div
                className="animate-fade-in rounded-xl border border-border bg-card p-6"
                style={{ animationDelay: "200ms" }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <FileSpreadsheet className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">Feature Columns</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "ID",
                    "Date",
                    "Time",
                    "CrimeType",
                    "Location",
                    "Lat",
                    "Lng",
                    "Severity",
                    "Status",
                  ].map((col) => (
                    <span
                      key={col}
                      className="rounded-full bg-secondary px-2 py-1 text-xs text-foreground"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="animate-fade-in rounded-xl border border-border bg-card p-6"
                style={{ animationDelay: "250ms" }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2">
                    <Code className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground">ML Ready</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dataset is preprocessed and ready for training. Use the export feature to download
                  and load into Python/scikit-learn.
                </p>
              </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="mb-8">
              <CrimeChart data={stats.monthlyCount} type="line" title="Monthly Crime Trend (2024)" />
            </div>

            {/* Data Table */}
            <DataTable data={crimeData} />

            {/* Python Code Example */}
            <div
              className="my-8 animate-fade-in rounded-xl border border-border bg-card p-6"
              style={{ animationDelay: "700ms" }}
            >
              <h3 className="mb-4 text-lg font-semibold text-foreground">Load Dataset in Python</h3>
              <pre className="overflow-x-auto rounded-lg bg-secondary p-4 font-mono text-sm text-foreground">
                {`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

# Load the exported CSV
df = pd.read_csv('crime_dataset.csv')

# Feature engineering
df['hour'] = pd.to_datetime(df['Time'], format='%H:%M').dt.hour
df['day_of_week'] = pd.to_datetime(df['Date']).dt.dayofweek

# Prepare features and labels
X = df[['hour', 'day_of_week', 'Latitude', 'Longitude']]
y = df['CrimeType']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = DecisionTreeClassifier(max_depth=10)
model.fit(X_train, y_train)
print(f"Accuracy: {model.score(X_test, y_test):.2%}")`}
              </pre>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
