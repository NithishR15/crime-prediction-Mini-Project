-- Create table for storing crime incidents
CREATE TABLE public.crime_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id TEXT UNIQUE NOT NULL,
  incident_date DATE NOT NULL,
  incident_time TIME NOT NULL,
  crime_type TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'resolved')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for prediction history
CREATE TABLE public.prediction_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  predicted_crime_type TEXT NOT NULL,
  probability DECIMAL(5, 4) NOT NULL,
  risk_level TEXT NOT NULL,
  confidence DECIMAL(5, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read for educational purposes)
ALTER TABLE public.crime_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (educational demo)
CREATE POLICY "Anyone can view crime incidents" 
ON public.crime_incidents 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert crime incidents" 
ON public.crime_incidents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view prediction logs" 
ON public.prediction_logs 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert prediction logs" 
ON public.prediction_logs 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_crime_incidents_updated_at
BEFORE UPDATE ON public.crime_incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();