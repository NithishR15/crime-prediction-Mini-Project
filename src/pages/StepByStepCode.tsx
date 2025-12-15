import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, CheckCircle, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const codeSteps = [
  {
    step: 1,
    title: "Import Libraries",
    description: "First, import all the required Python libraries",
    code: `# Step 1: Import Libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

print("✅ Libraries imported successfully!")`,
  },
  {
    step: 2,
    title: "Load Dataset",
    description: "Load the CSV file exported from the web app",
    code: `# Step 2: Load Dataset
# Make sure 'crime_dataset.csv' is in the same folder
df = pd.read_csv('crime_dataset.csv')

print(f"Dataset loaded: {len(df)} records")
print("\\nFirst 5 rows:")
print(df.head())
print("\\nColumns:", df.columns.tolist())`,
  },
  {
    step: 3,
    title: "Data Exploration",
    description: "Explore and understand the dataset",
    code: `# Step 3: Data Exploration
print("Data Types:")
print(df.dtypes)

print("\\nMissing Values:")
print(df.isnull().sum())

print("\\nCrime Types in Dataset:")
print(df['Crime Type'].unique())

print("\\nCrime Type Counts:")
print(df['Crime Type'].value_counts())`,
  },
  {
    step: 4,
    title: "Feature Engineering",
    description: "Create new features from existing data",
    code: `# Step 4: Feature Engineering

# Extract hour from time
df['Hour'] = pd.to_datetime(df['Time'], format='%H:%M:%S').dt.hour

# Create time of day categories
def get_time_of_day(hour):
    if 6 <= hour < 12:
        return 'morning'
    elif 12 <= hour < 18:
        return 'afternoon'
    elif 18 <= hour < 22:
        return 'evening'
    else:
        return 'night'

df['TimeOfDay'] = df['Hour'].apply(get_time_of_day)

# Get day of week (0=Monday, 6=Sunday)
df['DayOfWeek'] = pd.to_datetime(df['Date']).dt.dayofweek

# Is it weekend?
df['IsWeekend'] = df['DayOfWeek'].isin([5, 6]).astype(int)

print("✅ New features created:")
print("- Hour (0-23)")
print("- TimeOfDay (morning/afternoon/evening/night)")
print("- DayOfWeek (0-6)")
print("- IsWeekend (0 or 1)")`,
  },
  {
    step: 5,
    title: "Encode Categorical Variables",
    description: "Convert text categories to numbers for ML",
    code: `# Step 5: Encode Categorical Variables
# ML models need numbers, not text

le_location = LabelEncoder()
le_time = LabelEncoder()
le_crime = LabelEncoder()

df['Location_Encoded'] = le_location.fit_transform(df['Location'])
df['TimeOfDay_Encoded'] = le_time.fit_transform(df['TimeOfDay'])
df['CrimeType_Encoded'] = le_crime.fit_transform(df['Crime Type'])

print("Location Encoding:")
for loc, num in zip(le_location.classes_, range(len(le_location.classes_))):
    print(f"  {loc} -> {num}")

print("\\nCrime Type Encoding:")
for crime, num in zip(le_crime.classes_, range(len(le_crime.classes_))):
    print(f"  {crime} -> {num}")`,
  },
  {
    step: 6,
    title: "Prepare Features (X) and Labels (y)",
    description: "Select which columns to use for training",
    code: `# Step 6: Prepare Features (X) and Labels (y)

# Features = what we use to predict
feature_columns = ['Location_Encoded', 'Hour', 'DayOfWeek', 'IsWeekend', 'Latitude', 'Longitude']
X = df[feature_columns]

# Label = what we want to predict (crime type)
y = df['CrimeType_Encoded']

print(f"Features (X) shape: {X.shape}")
print(f"Labels (y) shape: {y.shape}")
print(f"\\nFeatures used: {feature_columns}")`,
  },
  {
    step: 7,
    title: "Split Data (Train/Test)",
    description: "Divide data into training set (80%) and test set (20%)",
    code: `# Step 7: Split Data into Training and Testing Sets

X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2,    # 20% for testing
    random_state=42   # For reproducibility
)

print(f"Training samples: {len(X_train)} (80%)")
print(f"Testing samples: {len(X_test)} (20%)")`,
  },
  {
    step: 8,
    title: "Train Decision Tree Model",
    description: "Create and train a Decision Tree classifier",
    code: `# Step 8: Train Decision Tree Model

dt_model = DecisionTreeClassifier(
    max_depth=10,         # Maximum depth of tree
    min_samples_split=5,  # Minimum samples to split
    random_state=42
)

# Train the model
dt_model.fit(X_train, y_train)

# Make predictions on test data
dt_predictions = dt_model.predict(X_test)

# Calculate accuracy
dt_accuracy = accuracy_score(y_test, dt_predictions)

print(f"✅ Decision Tree trained!")
print(f"Accuracy: {dt_accuracy:.2%}")`,
  },
  {
    step: 9,
    title: "Train Random Forest Model",
    description: "Create and train a Random Forest classifier (better accuracy)",
    code: `# Step 9: Train Random Forest Model
# Random Forest = Many Decision Trees working together

rf_model = RandomForestClassifier(
    n_estimators=100,  # Number of trees
    max_depth=10,
    random_state=42
)

# Train the model
rf_model.fit(X_train, y_train)

# Make predictions
rf_predictions = rf_model.predict(X_test)

# Calculate accuracy
rf_accuracy = accuracy_score(y_test, rf_predictions)

print(f"✅ Random Forest trained!")
print(f"Accuracy: {rf_accuracy:.2%}")

# Compare models
print(f"\\n📊 Model Comparison:")
print(f"Decision Tree: {dt_accuracy:.2%}")
print(f"Random Forest: {rf_accuracy:.2%}")
print(f"Winner: {'Random Forest' if rf_accuracy > dt_accuracy else 'Decision Tree'}")`,
  },
  {
    step: 10,
    title: "Model Evaluation",
    description: "Detailed evaluation with classification report",
    code: `# Step 10: Model Evaluation

print("=" * 50)
print("DECISION TREE - Classification Report")
print("=" * 50)
print(classification_report(y_test, dt_predictions, 
      target_names=le_crime.classes_))

print("\\n" + "=" * 50)
print("RANDOM FOREST - Classification Report")
print("=" * 50)
print(classification_report(y_test, rf_predictions,
      target_names=le_crime.classes_))`,
  },
  {
    step: 11,
    title: "Make New Predictions",
    description: "Use the trained model to predict crime for new inputs",
    code: `# Step 11: Make New Predictions

def predict_crime(location, hour, day_of_week):
    """
    Predict crime type for given location, hour, and day
    """
    # Encode location
    loc_encoded = le_location.transform([location])[0]
    is_weekend = 1 if day_of_week in [5, 6] else 0
    
    # Location coordinates (Chennai)
    location_coords = {
        'Anna Nagar': (13.085, 80.211),
        'T. Nagar': (13.042, 80.234),
        'Velachery': (12.982, 80.218),
        'Adyar': (13.001, 80.257),
        'Guindy': (13.007, 80.221),
        'Mylapore': (13.034, 80.268),
        'Nungambakkam': (13.057, 80.243),
        'Porur': (13.038, 80.156),
        'Tambaram': (12.925, 80.100),
        'Chrompet': (12.952, 80.146),
    }
    lat, lng = location_coords.get(location, (13.0, 80.2))
    
    # Create feature array
    features = [[loc_encoded, hour, day_of_week, is_weekend, lat, lng]]
    
    # Predict using Random Forest
    prediction = rf_model.predict(features)[0]
    probabilities = rf_model.predict_proba(features)[0]
    
    crime_type = le_crime.inverse_transform([prediction])[0]
    confidence = max(probabilities) * 100
    
    return crime_type, confidence

# Test predictions
print("🔮 Crime Predictions:")
print("-" * 50)

test_cases = [
    ('Anna Nagar', 22, 5),   # Night, Saturday
    ('T. Nagar', 14, 2),     # Afternoon, Wednesday
    ('Velachery', 8, 0),     # Morning, Monday
    ('Guindy', 20, 4),       # Evening, Friday
]

for location, hour, day in test_cases:
    crime, conf = predict_crime(location, hour, day)
    day_name = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]
    print(f"{location}, {hour}:00, {day_name}")
    print(f"  → Predicted: {crime} (Confidence: {conf:.1f}%)")
    print()`,
  },
  {
    step: 12,
    title: "Create Visualizations",
    description: "Generate charts to visualize the results",
    code: `# Step 12: Create Visualizations

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Crime Type Distribution
ax1 = axes[0, 0]
crime_counts = df['Crime Type'].value_counts()
ax1.bar(crime_counts.index, crime_counts.values, color='steelblue')
ax1.set_title('Crime Type Distribution', fontsize=12, fontweight='bold')
ax1.set_xlabel('Crime Type')
ax1.set_ylabel('Count')
ax1.tick_params(axis='x', rotation=45)

# 2. Crimes by Time of Day
ax2 = axes[0, 1]
time_counts = df['TimeOfDay'].value_counts()
colors = ['#FFD700', '#FF8C00', '#4169E1', '#191970']
ax2.pie(time_counts.values, labels=time_counts.index, autopct='%1.1f%%', colors=colors)
ax2.set_title('Crimes by Time of Day', fontsize=12, fontweight='bold')

# 3. Crimes by Location
ax3 = axes[1, 0]
location_counts = df['Location'].value_counts()
ax3.barh(location_counts.index, location_counts.values, color='coral')
ax3.set_title('Crimes by Location', fontsize=12, fontweight='bold')
ax3.set_xlabel('Count')

# 4. Feature Importance
ax4 = axes[1, 1]
importance = rf_model.feature_importances_
ax4.barh(feature_columns, importance, color='green')
ax4.set_title('Feature Importance (Random Forest)', fontsize=12, fontweight='bold')
ax4.set_xlabel('Importance Score')

plt.tight_layout()
plt.savefig('crime_analysis_results.png', dpi=150)
plt.show()

print("\\n✅ Visualizations saved to 'crime_analysis_results.png'")
print(f"\\n🎉 PROJECT COMPLETE!")
print(f"Decision Tree Accuracy: {dt_accuracy:.2%}")
print(f"Random Forest Accuracy: {rf_accuracy:.2%}")`,
  },
];

// Full combined code for download
const fullCode = codeSteps.map(s => s.code).join('\n\n');

export default function StepByStepCode() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyCode = (code: string, step: number) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(step);
    toast.success(`Step ${step} code copied!`);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const downloadFullCode = () => {
    const blob = new Blob([fullCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crime_prediction_complete.py";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Complete Python file downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/learn" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Learn
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Step-by-Step Python Code for VS Code
          </h1>
          <p className="mt-2 text-muted-foreground">
            Copy and run each step one by one in VS Code to understand how the ML model works.
          </p>
        </div>

        {/* Download Full Code Button */}
        <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Download Complete Code</h2>
              <p className="text-sm text-muted-foreground">Get all 12 steps in one Python file</p>
            </div>
            <Button variant="glow" onClick={downloadFullCode}>
              <Download className="h-4 w-4" />
              Download crime_prediction_complete.py
            </Button>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Before You Start</h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
              <span>Install Python from <a href="https://python.org" target="_blank" rel="noopener" className="text-primary hover:underline">python.org</a> (check "Add to PATH")</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
              <span>Run in terminal: <code className="rounded bg-secondary px-2 py-0.5">pip install pandas numpy scikit-learn matplotlib seaborn</code></span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
              <span>Export CSV from <Link to="/dataset" className="text-primary hover:underline">Dataset page</Link> and save as <code className="rounded bg-secondary px-2 py-0.5">crime_dataset.csv</code></span>
            </li>
          </ol>
        </div>

        {/* Code Steps */}
        <div className="space-y-6">
          {codeSteps.map((step) => (
            <div key={step.step} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCode(step.code, step.step)}
                >
                  {copiedStep === step.step ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="overflow-x-auto p-4 text-sm">
                <code className="text-foreground">{step.code}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* What's Next */}
        <div className="mt-8 rounded-xl border border-success/30 bg-success/5 p-6">
          <h2 className="mb-2 text-lg font-semibold text-foreground">🎉 Congratulations!</h2>
          <p className="text-sm text-muted-foreground">
            You have successfully built a Crime Prediction ML model! Try modifying the code to experiment with different parameters or add new features.
          </p>
        </div>
      </main>
    </div>
  );
}
