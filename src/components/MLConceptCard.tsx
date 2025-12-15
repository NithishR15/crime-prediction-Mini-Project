import { cn } from "@/lib/utils";
import { BookOpen, Code, Lightbulb } from "lucide-react";

interface MLConceptCardProps {
  concept: {
    id: string;
    title: string;
    description: string;
    example: string;
    algorithms: string[];
  };
  index: number;
}

export function MLConceptCard({ concept, index }: MLConceptCardProps) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50",
        "animate-fade-in opacity-0"
      )}
      style={{ animationDelay: `${index * 100 + 500}ms` }}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-accent/10 blur-2xl transition-all group-hover:bg-accent/20" />
      
      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">{concept.title}</h4>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {concept.description}
        </p>

        <div className="mb-4 rounded-lg bg-secondary p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-primary">
            <Lightbulb className="h-3 w-3" />
            Example in Crime Prediction
          </div>
          <p className="text-sm text-foreground">{concept.example}</p>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Code className="h-3 w-3" />
            Related Techniques
          </div>
          <div className="flex flex-wrap gap-2">
            {concept.algorithms.map((algo) => (
              <span 
                key={algo}
                className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                {algo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
