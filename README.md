# Pooled Pay

Welcome to **Pooled Pay**, an integrated payment and AI Merchant Risk Assessment platform. The system is built using a modern multi-tier architecture to deliver quick, reliable risk predictions and history tracking.

## Architecture Overview

The system consists of the following key components:

1. **React Frontend (Vite)**: A responsive and modern AI Copilot interface that allows users to adjust merchant parameters, visualize risk gauges, and view assessment histories.
2. **Spring Boot Backend (Java)**: Serves as the orchestration layer. It handles requests from the frontend, queries the database, and communicates with the AI microservice.
3. **Python AI Microservice (FastAPI)**: A machine learning engine that calculates risk probabilities, derives a risk score, and provides actionable recommendations.

---

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js & npm**: For running the React frontend.
- **Java 17+ & Maven**: For compiling and running the Spring Boot backend.
- **Python 3.10+**: For the ML microservice.

---

## Setup & Running the Application

### 1. Starting the Python AI Microservice

The AI engine runs as a lightweight FastAPI microservice. *(Ensure you run this from its project directory.)*

1. Navigate to the Python microservice directory:
   ```bash
   cd merchant_risk_project
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python main.py
   ```
   *The server will start at `http://localhost:8000`*

### 2. Starting the Spring Boot Backend

The backend acts as the orchestrator. It receives frontend requests, queries the H2 Database for history, and calls the Python microservice for new predictions.

1. Navigate to the backend directory:
   ```bash
   cd pooled-pay-backend
   ```
2. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run   # On Windows: .\mvnw.cmd spring-boot:run
   ```
   *The backend will start at `http://localhost:8082`*

### 3. Starting the React Frontend

The frontend features the AI Copilot Chatbot interface.

1. Navigate to the frontend directory:
   ```bash
   cd pooled-pay-frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will start at `http://localhost:5173`*

---

## Deployment

The frontend of this application is configured for continuous deployment using GitHub Actions. 
- The `.github/workflows/deploy.yml` workflow automatically builds and deploys the `pooled-pay-frontend` to **GitHub Pages** whenever changes are pushed to the `main` branch.

## Architecture Flow

1. **User Input:** The user adjusts the 20 merchant parameters in the AI Copilot UI and clicks "Generate Risk Prediction".
2. **Frontend -> Backend:** React sends a `POST` request to `http://localhost:8082/api/ai/predict-risk`.
3. **Backend -> Microservice:** Spring Boot formats the data and sends it via `RestTemplate` to the Python microservice at `http://localhost:8000/predict-risk`.
4. **ML Inference:** The Python engine loads a `risk_model.pkl` (Random Forest Classifier), calculates probabilities to derive a risk score (0-100), and uses feature-based heuristics to generate explanations.
5. **Microservice -> Backend:** Python returns the score, level, confidence, and explanations.
6. **Persistence:** Spring Boot saves the entire assessment in the `merchant_risk_assessments` table in the H2 Database.
7. **Backend -> Frontend:** The full assessment (including database ID) is returned to React.
8. **UI Rendering:** The React UI smoothly animates the risk gauge, updates the history panel, and provides actionable recommendations.
