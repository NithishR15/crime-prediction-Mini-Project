import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { CrimeChart } from "@/components/CrimeChart";
import { HeatmapGrid } from "@/components/HeatmapGrid";
import { PredictionPanel } from "@/components/PredictionPanel";
import { useCrimeIncidents, getCrimeStats } from "@/hooks/useCrimeData";
import { AlertTriangle, MapPin, TrendingUp, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export default function Index() {
  const {
    data: crimeData,
    isLoading,
    error
  } = useCrimeIncidents();
  const stats = crimeData ? getCrimeStats(crimeData) : null;
  const uniqueLocations = crimeData ? new Set(crimeData.map(d => d.location)).size : 0;
  const uniqueCrimeTypes = crimeData ? new Set(crimeData.map(d => d.crime_type)).size : 0;
  return <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Machine Learning Crime Prediction System
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in" style={{
            animationDelay: "100ms"
          }}>
              Predict Crime with <span className="text-gradient">Machine Learning</span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground animate-fade-in" style={{
            animationDelay: "200ms"
          }}>
              An educational platform for engineering students to learn ML concepts through real-world crime prediction. Explore datasets, train models, and visualize results.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in" style={{
            animationDelay: "300ms"
          }}>
              <Link to="/predict">
                <Button variant="glow" size="lg">
                  Try Prediction
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" size="lg">
                  Learn ML Concepts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading crime data from database...</p>
          </div>
        </section>}

      {/* Error State */}
      {error && <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-destructive" />
            <p className="text-destructive">Failed to load crime data. Please try again later.</p>
          </div>
        </section>}

      {/* Stats Section */}
      {crimeData && stats && <>
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Incidents" value={crimeData.length} subtitle="In database" icon={AlertTriangle} trend={{
            value: 12,
            isPositive: false
          }} delay={0} />
              <StatCard title="Locations Covered" value={uniqueLocations} subtitle="Chennai areas" icon={MapPin} delay={100} />
              <StatCard title="Crime Types" value={uniqueCrimeTypes} subtitle="Categories" icon={TrendingUp} delay={200} />
              <StatCard title="Last Updated" value="Live" subtitle="Real-time sync" icon={Clock} delay={300} />
            </div>
          </section>

          {/* Charts Section */}
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Data Analytics Dashboard</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <CrimeChart data={stats.typeCount} type="bar" title="Incidents by Crime Type" />
              <CrimeChart data={stats.severityCount} type="pie" title="Severity Distribution" />
            </div>
          </section>

          {/* Heatmap Section */}
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <HeatmapGrid data={stats.locationCount} />
          </section>
        </>}

      {/* Prediction Panel */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <PredictionPanel />
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Crime Prediction - Educational Machine Learning for Engineering Students
           
          
            </p>
            <div className="flex gap-4">
              <span className="text-xs text-muted-foreground">
                Built with: Python • scikit-learn • React • Tailwind
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}