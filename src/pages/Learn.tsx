import { Header } from "@/components/Header";
import { MLConceptCard } from "@/components/MLConceptCard";
import { mlConcepts } from "@/data/crimeData";
import {
  BookOpen,
  Code,
  Terminal,
  Download,
  Play,
  CheckCircle,
  Copy,
  ExternalLink,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const pythonSetupCode = `# Step 1: Install Python (Download from python.org)
# Step 2: Open Terminal/Command Prompt and run:

pip install pandas numpy scikit-learn matplotlib seaborn jupyter`;

const fullMLCode = `# ============================================
# CRIME PREDICTION ML MODEL - Complete Code
# For 3rd Year Engineering Students
# ============================================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# ============================================
# STEP 1: LOAD THE DATASET
# ============================================
# Export CSV from the web app (Dataset page -> Export CSV)
# Save it as 'crime_dataset.csv' in the same folder

print("Step 1: Loading Dataset...")
df = pd.read_csv('crime_dataset.csv')
print(f"Dataset loaded: {len(df)} records")
print(df.head())

# ============================================
# STEP 2: DATA EXPLORATION
# ============================================
print("\\nStep 2: Data Exploration...")
print(f"Columns: {df.columns.tolist()}")
print(f"\\nData Types:\\n{df.dtypes}")
print(f"\\nMissing Values:\\n{df.isnull().sum()}")
print(f"\\nCrime Types: {df['Crime Type'].unique()}")

# ============================================
# STEP 3: FEATURE ENGINEERING
# ============================================
print("\\nStep 3: Feature Engineering...")

# Convert time to hour (numerical feature)
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

# Convert date to day of week
df['DayOfWeek'] = pd.to_datetime(df['Date']).dt.dayofweek
df['IsWeekend'] = df['DayOfWeek'].isin([5, 6]).astype(int)

print("New features created: Hour, TimeOfDay, DayOfWeek, IsWeekend")

# ============================================
# STEP 4: ENCODE CATEGORICAL VARIABLES
# ============================================
print("\\nStep 4: Encoding Categorical Variables...")

# Initialize label encoders
le_location = LabelEncoder()
le_time = LabelEncoder()
le_crime = LabelEncoder()

# Encode features
df['Location_Encoded'] = le_location.fit_transform(df['Location'])
df['TimeOfDay_Encoded'] = le_time.fit_transform(df['TimeOfDay'])
df['CrimeType_Encoded'] = le_crime.fit_transform(df['Crime Type'])

print(f"Locations: {dict(zip(le_location.classes_, range(len(le_location.classes_))))}")
print(f"Crime Types: {dict(zip(le_crime.classes_, range(len(le_crime.classes_))))}")

# ============================================
# STEP 5: PREPARE FEATURES AND LABELS
# ============================================
print("\\nStep 5: Preparing Features and Labels...")

# Select features for training
feature_columns = ['Location_Encoded', 'Hour', 'DayOfWeek', 'IsWeekend', 'Latitude', 'Longitude']
X = df[feature_columns]
y = df['CrimeType_Encoded']

print(f"Features shape: {X.shape}")
print(f"Labels shape: {y.shape}")

# ============================================
# STEP 6: SPLIT DATA (80% train, 20% test)
# ============================================
print("\\nStep 6: Splitting Data...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

# ============================================
# STEP 7: TRAIN DECISION TREE MODEL
# ============================================
print("\\nStep 7: Training Decision Tree Model...")

dt_model = DecisionTreeClassifier(
    max_depth=10,
    min_samples_split=5,
    random_state=42
)
dt_model.fit(X_train, y_train)

# Make predictions
dt_predictions = dt_model.predict(X_test)
dt_accuracy = accuracy_score(y_test, dt_predictions)

print(f"Decision Tree Accuracy: {dt_accuracy:.2%}")

# ============================================
# STEP 8: TRAIN RANDOM FOREST MODEL
# ============================================
print("\\nStep 8: Training Random Forest Model...")

rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)
rf_model.fit(X_train, y_train)

# Make predictions
rf_predictions = rf_model.predict(X_test)
rf_accuracy = accuracy_score(y_test, rf_predictions)

print(f"Random Forest Accuracy: {rf_accuracy:.2%}")

# ============================================
# STEP 9: MODEL EVALUATION
# ============================================
print("\\nStep 9: Model Evaluation...")
print("\\n--- Decision Tree Classification Report ---")
print(classification_report(y_test, dt_predictions, 
      target_names=le_crime.classes_))

print("\\n--- Random Forest Classification Report ---")
print(classification_report(y_test, rf_predictions,
      target_names=le_crime.classes_))

# ============================================
# STEP 10: MAKE NEW PREDICTIONS
# ============================================
print("\\nStep 10: Making New Predictions...")

def predict_crime(location, hour, day_of_week, model=rf_model):
    """
    Predict crime type for given inputs
    """
    # Encode location
    loc_encoded = le_location.transform([location])[0]
    is_weekend = 1 if day_of_week in [5, 6] else 0
    
    # Get coordinates for location (approximate)
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
    
    # Predict
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    
    crime_type = le_crime.inverse_transform([prediction])[0]
    confidence = max(probabilities) * 100
    
    return crime_type, confidence

# Test predictions
print("\\n--- Sample Predictions ---")
test_cases = [
    ('Anna Nagar', 22, 5),  # Night, Saturday
    ('T. Nagar', 14, 2),    # Afternoon, Wednesday
    ('Velachery', 8, 0),    # Morning, Monday
]

for location, hour, day in test_cases:
    crime, conf = predict_crime(location, hour, day)
    print(f"Location: {location}, Hour: {hour}, Day: {day}")
    print(f"  Predicted Crime: {crime}, Confidence: {conf:.1f}%\\n")

# ============================================
# STEP 11: VISUALIZATIONS
# ============================================
print("\\nStep 11: Creating Visualizations...")

# Create figure with subplots
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Crime Type Distribution
ax1 = axes[0, 0]
crime_counts = df['Crime Type'].value_counts()
ax1.bar(crime_counts.index, crime_counts.values, color='steelblue')
ax1.set_title('Crime Type Distribution')
ax1.set_xlabel('Crime Type')
ax1.set_ylabel('Count')
ax1.tick_params(axis='x', rotation=45)

# 2. Crimes by Time of Day
ax2 = axes[0, 1]
time_counts = df['TimeOfDay'].value_counts()
colors = ['#FFD700', '#FF8C00', '#4169E1', '#191970']
ax2.pie(time_counts.values, labels=time_counts.index, autopct='%1.1f%%', colors=colors)
ax2.set_title('Crimes by Time of Day')

# 3. Crimes by Location
ax3 = axes[1, 0]
location_counts = df['Location'].value_counts()
ax3.barh(location_counts.index, location_counts.values, color='coral')
ax3.set_title('Crimes by Location')
ax3.set_xlabel('Count')

# 4. Feature Importance (Random Forest)
ax4 = axes[1, 1]
importance = rf_model.feature_importances_
ax4.barh(feature_columns, importance, color='green')
ax4.set_title('Feature Importance (Random Forest)')
ax4.set_xlabel('Importance')

plt.tight_layout()
plt.savefig('crime_analysis_results.png', dpi=150)
plt.show()

print("\\n✅ Analysis complete! Results saved to 'crime_analysis_results.png'")
print(f"\\n📊 Final Model Comparison:")
print(f"   Decision Tree Accuracy: {dt_accuracy:.2%}")
print(f"   Random Forest Accuracy: {rf_accuracy:.2%}")
print(f"   Best Model: {'Random Forest' if rf_accuracy > dt_accuracy else 'Decision Tree'}")`;

const resources = [
  { name: "scikit-learn Documentation", url: "https://scikit-learn.org/stable/" },
  { name: "Kaggle Crime Datasets", url: "https://www.kaggle.com/datasets?search=crime" },
  { name: "Decision Tree Explained", url: "https://en.wikipedia.org/wiki/Decision_tree_learning" },
  { name: "Google Colab (Free)", url: "https://colab.research.google.com" },
];

export default function Learn() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (code: string, section: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(section);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <BookOpen className="h-4 w-4" />
            Complete Step-by-Step Guide
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Run ML Code: Complete Guide
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Everything you need to run the Crime Prediction ML model on your computer.
            Follow these steps in order.
          </p>
        </div>

        {/* Quick Start Steps */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: 1, title: "Install Python", icon: Download, desc: "python.org" },
            { step: 2, title: "Install Libraries", icon: Terminal, desc: "pip install" },
            { step: 3, title: "Export Dataset", icon: Code, desc: "From web app" },
            { step: 4, title: "Run Code", icon: Play, desc: "Jupyter/VS Code" },
          ].map((item, i) => (
            <div
              key={item.step}
              className="animate-fade-in rounded-xl border border-border bg-card p-5 opacity-0"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Step 1: Install Python */}
        <section className="mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Step 1: Install Required Software
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-secondary/50 p-4">
                <h3 className="mb-2 font-medium text-foreground">
                  Install Python 3.9+
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  Download Python from the official website:
                </p>
                <a
                  href="https://www.python.org/downloads/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  https://www.python.org/downloads/
                  <ExternalLink className="h-4 w-4" />
                </a>
                <div className="mt-3 rounded bg-warning/10 p-2 text-sm text-warning">
                  ⚠️ IMPORTANT: Check "Add Python to PATH" during installation!
                </div>
              </div>

              <div className="relative">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-foreground">
                    Install Python Libraries (Run in Terminal)
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(pythonSetupCode, "setup")}
                  >
                    {copiedSection === "setup" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-secondary p-4 font-mono text-sm text-foreground">
                  {pythonSetupCode}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Export Dataset */}
        <section className="mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Code className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Step 2: Export Dataset from This App
              </h2>
            </div>

            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <span className="pt-0.5">
                  Go to the{" "}
                  <Link to="/dataset" className="font-medium text-primary hover:underline">
                    Dataset page
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <span className="pt-0.5">Click the "Export CSV" button in the top right corner</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <span className="pt-0.5">
                  Save the file as <code className="rounded bg-secondary px-2 py-0.5 text-primary">crime_dataset.csv</code>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  4
                </span>
                <span className="pt-0.5">Place the CSV file in the same folder as your Python script</span>
              </li>
            </ol>

            <div className="mt-4">
              <Link to="/dataset">
                <Button variant="outline">
                  Go to Dataset Page
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Step 3: Complete ML Code */}
        <section className="mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Terminal className="h-5 w-5 text-success" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Step 3: Complete Python ML Code
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([fullMLCode], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "crime_prediction.py";
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Python file downloaded!");
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download .py File
                </Button>
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => copyToClipboard(fullMLCode, "fullcode")}
                >
                  {copiedSection === "fullcode" ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy All Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              This complete code includes all 11 steps: data loading, exploration,
              feature engineering, encoding, model training (Decision Tree + Random Forest),
              evaluation, predictions, and visualizations.
            </p>

            <div className="max-h-[500px] overflow-auto rounded-lg bg-secondary">
              <pre className="p-4 font-mono text-xs text-foreground">
                {fullMLCode}
              </pre>
            </div>
          </div>
        </section>

        {/* Step 4: How to Run */}
        <section className="mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Play className="h-5 w-5 text-warning" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Step 4: Choose How to Run the Code
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-success/50 bg-success/5 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <span className="rounded bg-success px-2 py-0.5 text-xs text-success-foreground">EASIEST</span>
                  Google Colab (No Installation)
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Go to <a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">colab.research.google.com</a></li>
                  <li>2. Click "New Notebook"</li>
                  <li>3. Click Files icon (left) → Upload → Select your CSV</li>
                  <li>4. Paste the code and press Shift+Enter</li>
                  <li>5. View results inline!</li>
                </ol>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4">
                <h3 className="mb-3 font-semibold text-foreground">
                  Jupyter Notebook
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Open Terminal/Command Prompt</li>
                  <li>2. Run: <code className="text-primary">jupyter notebook</code></li>
                  <li>3. Click "New" → "Python 3"</li>
                  <li>4. Paste code and press Shift+Enter</li>
                </ol>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4">
                <h3 className="mb-3 font-semibold text-foreground">
                  VS Code
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Install VS Code + Python extension</li>
                  <li>2. Create file: <code className="text-primary">crime_prediction.py</code></li>
                  <li>3. Paste the complete code</li>
                  <li>4. Click ▶️ Run Python File button</li>
                </ol>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4">
                <h3 className="mb-3 font-semibold text-foreground">
                  PyCharm
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Download PyCharm Community (free)</li>
                  <li>2. Create new Python project</li>
                  <li>3. Create .py file and paste code</li>
                  <li>4. Right-click → Run</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Expected Output */}
        <section className="mb-8">
          <div className="rounded-xl border border-success/50 bg-success/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-success" />
              <h2 className="text-xl font-semibold text-foreground">
                Expected Output (What You'll See)
              </h2>
            </div>

            <pre className="overflow-x-auto rounded-lg bg-secondary p-4 font-mono text-xs text-foreground">
{`Step 1: Loading Dataset...
Dataset loaded: 50 records

Step 7: Training Decision Tree Model...
Decision Tree Accuracy: 65.00%

Step 8: Training Random Forest Model...
Random Forest Accuracy: 72.00%

--- Sample Predictions ---
Location: Anna Nagar, Hour: 22, Day: 5
  Predicted Crime: Theft, Confidence: 45.2%

Location: T. Nagar, Hour: 14, Day: 2
  Predicted Crime: Fraud, Confidence: 38.7%

✅ Analysis complete! Results saved to 'crime_analysis_results.png'

📊 Final Model Comparison:
   Decision Tree Accuracy: 65.00%
   Random Forest Accuracy: 72.00%
   Best Model: Random Forest`}
            </pre>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Helpful Resources</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource, index) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-fade-in group flex items-center gap-3 rounded-xl border border-border bg-card p-4 opacity-0 transition-all hover:border-primary/50 hover:bg-secondary"
                style={{ animationDelay: `${index * 100 + 800}ms` }}
              >
                <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                  <ExternalLink className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{resource.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ML Concepts */}
        <section className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              ML Concepts Reference
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mlConcepts.map((concept, index) => (
              <MLConceptCard key={concept.id} concept={concept} index={index} />
            ))}
          </div>
        </section>

        {/* Project Structure */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-foreground">Recommended Project Structure</h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileCode className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">crime-prediction-project/</span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-secondary p-4 font-mono text-sm text-muted-foreground">
{`├── crime_dataset.csv          # Exported from web app
├── crime_prediction.py        # Main ML code
├── crime_analysis_results.png # Generated visualization
└── README.md                  # Project documentation`}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
