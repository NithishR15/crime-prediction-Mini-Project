import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CrimeIncident {
  id: string;
  incident_id: string;
  incident_date: string;
  incident_time: string;
  crime_type: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: "low" | "medium" | "high";
  status: "reported" | "investigating" | "resolved";
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PredictionLog {
  id: string;
  location: string;
  time_of_day: string;
  day_of_week: string;
  predicted_crime_type: string;
  probability: number;
  risk_level: string;
  confidence: number;
  created_at: string;
}

// Fetch all crime incidents
export function useCrimeIncidents() {
  return useQuery({
    queryKey: ["crime-incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crime_incidents")
        .select("*")
        .order("incident_date", { ascending: false });

      if (error) {
        toast.error("Failed to fetch crime data");
        throw error;
      }

      return data as CrimeIncident[];
    },
  });
}

// Fetch prediction logs
export function usePredictionLogs() {
  return useQuery({
    queryKey: ["prediction-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prediction_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        toast.error("Failed to fetch prediction history");
        throw error;
      }

      return data as PredictionLog[];
    },
  });
}

// Insert a new crime incident
export function useInsertCrimeIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (incident: Omit<CrimeIncident, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("crime_incidents")
        .insert(incident)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crime-incidents"] });
      toast.success("Crime incident added successfully");
    },
    onError: () => {
      toast.error("Failed to add crime incident");
    },
  });
}

// Insert a prediction log
export function useInsertPrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prediction: Omit<PredictionLog, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("prediction_logs")
        .insert(prediction)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prediction-logs"] });
    },
    onError: () => {
      toast.error("Failed to save prediction");
    },
  });
}

// Calculate statistics from crime data
export function getCrimeStats(data: CrimeIncident[]) {
  const typeCount: Record<string, number> = {};
  const locationCount: Record<string, number> = {};
  const severityCount = { low: 0, medium: 0, high: 0 };
  const monthlyCount: Record<string, number> = {};

  data.forEach((record) => {
    typeCount[record.crime_type] = (typeCount[record.crime_type] || 0) + 1;
    locationCount[record.location] = (locationCount[record.location] || 0) + 1;
    
    if (record.severity in severityCount) {
      severityCount[record.severity as keyof typeof severityCount]++;
    }

    const month = record.incident_date.substring(0, 7);
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });

  return { typeCount, locationCount, severityCount, monthlyCount };
}
