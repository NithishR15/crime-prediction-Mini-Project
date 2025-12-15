import { cn } from "@/lib/utils";
import { chennaiLocations } from "@/data/crimeData";

interface HeatmapGridProps {
  data: Record<string, number>;
  className?: string;
}

export function HeatmapGrid({ data, className }: HeatmapGridProps) {
  const maxValue = Math.max(...Object.values(data), 1);
  
  const getIntensity = (value: number) => {
    const ratio = value / maxValue;
    if (ratio > 0.7) return 'bg-destructive/80';
    if (ratio > 0.4) return 'bg-warning/70';
    if (ratio > 0.2) return 'bg-primary/60';
    return 'bg-success/50';
  };

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-6",
      "animate-fade-in opacity-0",
      className
    )} style={{ animationDelay: '300ms' }}>
      <h3 className="mb-4 text-lg font-semibold text-foreground">Crime Hotspot Map - Chennai</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Intensity based on incident count per location
      </p>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {chennaiLocations.map((location) => {
          const count = data[location.name] || 0;
          return (
            <div
              key={location.name}
              className={cn(
                "group relative cursor-pointer rounded-lg p-4 transition-all duration-300 hover:scale-105",
                getIntensity(count)
              )}
            >
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{location.name}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-foreground/70">incidents</p>
              </div>
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-card px-3 py-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <p className="whitespace-nowrap text-xs text-muted-foreground">
                  Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success/50" />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-primary/60" />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-warning/70" />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-destructive/80" />
          <span className="text-xs text-muted-foreground">Critical</span>
        </div>
      </div>
    </div>
  );
}
