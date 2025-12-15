export interface CrimeRecord {
  id: string;
  date: string;
  time: string;
  crimeType: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high';
  status: 'reported' | 'investigating' | 'resolved';
}

export const crimeTypes = [
  'Theft',
  'Burglary',
  'Assault',
  'Vandalism',
  'Robbery',
  'Fraud',
  'Vehicle Theft',
  'Drug Offense',
];

export const chennaiLocations = [
  { name: 'Anna Nagar', lat: 13.0850, lng: 80.2101 },
  { name: 'T. Nagar', lat: 13.0418, lng: 80.2341 },
  { name: 'Velachery', lat: 12.9815, lng: 80.2180 },
  { name: 'Adyar', lat: 13.0012, lng: 80.2565 },
  { name: 'Guindy', lat: 13.0067, lng: 80.2206 },
  { name: 'Mylapore', lat: 13.0339, lng: 80.2676 },
  { name: 'Nungambakkam', lat: 13.0569, lng: 80.2425 },
  { name: 'Porur', lat: 13.0382, lng: 80.1558 },
  { name: 'Tambaram', lat: 12.9249, lng: 80.1000 },
  { name: 'Chrompet', lat: 12.9516, lng: 80.1462 },
];

// Generate mock crime data
export const generateMockData = (count: number): CrimeRecord[] => {
  const data: CrimeRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    const location = chennaiLocations[Math.floor(Math.random() * chennaiLocations.length)];
    const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
    const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    data.push({
      id: `CR${String(i + 1).padStart(5, '0')}`,
      date: date.toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      crimeType,
      location: location.name,
      latitude: location.lat + (Math.random() - 0.5) * 0.02,
      longitude: location.lng + (Math.random() - 0.5) * 0.02,
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      status: ['reported', 'investigating', 'resolved'][Math.floor(Math.random() * 3)] as 'reported' | 'investigating' | 'resolved',
    });
  }
  
  return data;
};

export const mockCrimeData = generateMockData(150);

// Statistics
export const getCrimeStats = (data: CrimeRecord[]) => {
  const typeCount: Record<string, number> = {};
  const locationCount: Record<string, number> = {};
  const severityCount = { low: 0, medium: 0, high: 0 };
  const monthlyCount: Record<string, number> = {};

  data.forEach((record) => {
    typeCount[record.crimeType] = (typeCount[record.crimeType] || 0) + 1;
    locationCount[record.location] = (locationCount[record.location] || 0) + 1;
    severityCount[record.severity]++;
    
    const month = record.date.substring(0, 7);
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });

  return { typeCount, locationCount, severityCount, monthlyCount };
};

// ML Educational Content
export const mlConcepts = [
  {
    id: 'supervised',
    title: 'Supervised Learning',
    description: 'Learn from labeled training data to make predictions on new data.',
    example: 'Using historical crime data (features) with known crime types (labels) to predict future incidents.',
    algorithms: ['Decision Trees', 'Logistic Regression', 'SVM', 'Random Forest'],
  },
  {
    id: 'features',
    title: 'Feature Engineering',
    description: 'Select and transform raw data into meaningful features for ML models.',
    example: 'Converting time to "morning/afternoon/night", extracting day of week, calculating distance from hotspots.',
    algorithms: ['Normalization', 'One-Hot Encoding', 'Feature Scaling'],
  },
  {
    id: 'evaluation',
    title: 'Model Evaluation',
    description: 'Assess how well your model performs using various metrics.',
    example: 'Accuracy, Precision, Recall, F1-Score, Confusion Matrix',
    algorithms: ['Cross-Validation', 'Train-Test Split', 'ROC Curve'],
  },
  {
    id: 'preprocessing',
    title: 'Data Preprocessing',
    description: 'Clean and prepare data before training ML models.',
    example: 'Handling missing values, removing outliers, encoding categorical variables.',
    algorithms: ['Imputation', 'Outlier Detection', 'Label Encoding'],
  },
];
