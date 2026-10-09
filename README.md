# Stupidyante OS
An offline-first academic workspace powered by local AI. 

## 🚀 Setup Instructions
Since this project relies on a 100% local and air-gapped AI model, you will need to run three separate services on your machine: Ollama (AI), FastAPI (Backend), and Vite/React (Frontend).

### 1. Local AI Setup (Ollama)
We use `llama3.2:3b` for fast, local inference.
1. Download and install [Ollama](https://ollama.com/).
2. Open your terminal and pull/run the model:
   ```bash
   ollama run llama3.2:3b
   ```
*(Keep Ollama running in the background).*

### 2. Backend Setup (Python / FastAPI)
Open a new terminal window for the backend.
```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install required packages
pip install fastapi uvicorn ollama pydantic

# Start the backend server
uvicorn main:app --reload
```
The backend will be running on `http://localhost:8000`.

### 3. Frontend Setup (React / Vite)
Open a third terminal window for the frontend.
```bash
cd frontend

# Install dependencies (zustand, tailwind, lucide-react, etc.)
npm install

# Start the development server
npm run dev
```
Open the provided localhost link in your browser to view the app!
