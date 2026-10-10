
# Stupidyante OS

**An offline-first academic workspace powered by local AI.**

Stupidyante is a student productivity workspace designed to help students organize their academic tasks while providing AI capabilities powered by a locally running language model.

The project uses **Ollama** to run Meta's Llama 3.2 3B model locally, **FastAPI** for the Python backend, and **React + Vite** for the frontend.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Icons | Lucide React |
| Resizable / Draggable UI | react-rnd |
| Backend | Python, FastAPI |
| Backend Server | Uvicorn |
| Local AI Runtime | Ollama |
| AI Model | Llama 3.2 3B |
| Backend Validation | Pydantic |

## Prerequisites

Install the following before running the project:

- [Git](https://git-scm.com/)
- [Node.js and npm](https://nodejs.org/)
- [Python](https://www.python.org/downloads/)
- [Ollama](https://ollama.com/)

Make sure `git`, `node`, `npm`, `python` (or `python3`), and `ollama` are accessible from your terminal.

## Setup Instructions

The development setup uses three components:

1. **Ollama** — runs the local AI model.
2. **FastAPI** — provides the Python backend.
3. **React + Vite** — serves the frontend.

Run the backend and frontend in separate terminals. Ollama must also be running and accessible to the backend.

### 1. Set Up the Local AI Model

Install Ollama from [ollama.com](https://ollama.com/).

Open a terminal and run:

```bash
ollama run llama3.2:3b
```

On first use, Ollama downloads the model, so an internet connection is generally required. Wait for the download to finish.

Ollama runs inference locally after the model is available on your machine. Keep the Ollama service available while using the application.

**Model:** `llama3.2:3b`

### 2. Set Up the Backend

Open a new terminal in the project root directory, then navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the environment.

**Windows — Command Prompt:**

```bat
venv\Scripts\activate.bat
```

**Windows — PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

**Windows — Git Bash:**

```bash
source venv/Scripts/activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
python -m pip install fastapi uvicorn ollama pydantic
```

Start the backend:

```bash
uvicorn main:app --reload
```

The backend should be available at:

`http://localhost:8000`

If FastAPI's interactive API documentation is enabled, you can inspect it at:

`http://localhost:8000/docs`

Keep this terminal running.

### 3. Set Up the Frontend

Open another terminal in the project root directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Vite will print a local URL in the terminal, typically:

`http://localhost:5173`

Open the exact URL shown in your terminal in your browser.

Keep this terminal running as well.

## Running the Application

Before using Stupidyante, ensure that:

- Ollama is installed and the `llama3.2:3b` model has been downloaded.
- The Ollama service is running.
- The FastAPI backend has started successfully.
- The Vite frontend is running.
- The frontend is configured to communicate with the correct backend address.

The frontend, backend, and Ollama must be able to communicate with one another for AI features to work.

## Offline Usage

Stupidyante is designed around local AI inference to reduce dependence on cloud-hosted AI services.

After downloading the model and installing the required dependencies, local AI inference can run without downloading the model again for each request. However, **offline operation of the entire application depends on its implementation and configuration**.

The initial setup may require internet access to download the AI model and install dependencies. Other external services, if used, may also require connectivity.

To verify offline operation:

1. Complete the initial installation while connected to the internet.
2. Confirm that Ollama, the backend, and the frontend all work.
3. Disconnect from the internet.
4. Test the AI functionality and the application's core features.
5. Record which features continue to work and which require connectivity.

Do not assume all features work offline until they have been tested.

## Troubleshooting

### Ollama command not found

Make sure Ollama is installed and accessible from your terminal. Restart the terminal after installation if necessary.

### Model is missing or unavailable

Run:

```bash
ollama run llama3.2:3b
```

Allow the initial download to complete before trying offline operation.

### Backend fails to start

- Ensure you are inside the `backend` directory.
- Confirm that the Python virtual environment is activated.
- Install the required Python packages.
- Check that `main.py` exists in the current directory.
- Review the terminal output for errors.

### Frontend cannot connect to the backend

- Confirm that FastAPI is running at `http://localhost:8000`.
- Check the frontend's backend URL configuration.
- Check for browser console errors, CORS issues, or incorrect API routes.

### Port already in use

Another process may already be using the required port. Stop that process or configure the service to use an available port and update any corresponding application configuration.

## Development Notes

- Run frontend commands from the `frontend` directory.
- Run backend commands from the `backend` directory.
- Activate the Python virtual environment before running backend commands.
- Keep the required services running while testing the application.
- Do not commit virtual environments, `node_modules`, build output, environment secrets, or API keys.

## Project Status

Stupidyante is being developed as an offline-first academic workspace with local AI capabilities. Available features and offline behavior should be evaluated against the current implementation.
