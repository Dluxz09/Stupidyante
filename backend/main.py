import re, ollama, sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

MODEL = "llama3.2:3b"
app = FastAPI(title="Stupidyante OS AI")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Initialize SQLite database
DB_FILE = "stupidyante.db"
def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT)")
init_db()

def chat(system, user, schema=None):
    r = ollama.chat(model=MODEL,
        messages=[{"role":"system","content":system},{"role":"user","content":user}],
        format=schema, options={"temperature":0.2})
    return r["message"]["content"]

class Text(BaseModel): text: str
class Subject(BaseModel): code:str; name:str; room:str; time:str
class COR(BaseModel): student_name:str; student_id:str; program:str; subjects:list[Subject]

@app.post("/cor")
def cor(b: Text):
    return COR.model_validate_json(chat(
      "Extract student data from this Certificate of Registration. Empty string if missing. Do not invent data.",
      b.text, COR.model_json_schema()))

class Note(BaseModel): text:str
@app.post("/notes")
def save_note(n: Note):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.execute("INSERT INTO notes (text) VALUES (?)", (n.text,))
        conn.commit()
        return {"ok": True, "id": cursor.lastrowid}

@app.get("/notes")
def get_all_notes():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.execute("SELECT id, text FROM notes")
        return [{"id": row[0], "text": row[1]} for row in cursor.fetchall()]

@app.get("/notes/{note_id}")
def get_note(note_id: int):
     with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.execute("SELECT text FROM notes WHERE id = ?", (note_id,))
        row = cursor.fetchone()
        return {"text": row[0]} if row else {"error": "Not found"}

@app.post("/summarize")
def summarize(b: Text):
    return {"summary": chat("Summarize in 5 short bullet points for a student.", b.text)}

class Q(BaseModel): question:str; choices:list[str]; answer_index:int; explanation:str
class Quiz(BaseModel): questions:list[Q]
@app.post("/quiz/{note_id}")
def quiz(note_id:int, count:int=5):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.execute("SELECT text FROM notes WHERE id = ?", (note_id,))
        row = cursor.fetchone()
        
    if not row:
        return {"error": "Note not found"}
        
    return Quiz.model_validate_json(chat(
      f"Create {count} multiple-choice questions with exactly 4 choices each, based ONLY on the note.",
      row[0], Quiz.model_json_schema()))

PATTERNS = {"AWS key":r"AKIA[0-9A-Z]{16}", "OpenAI/Stripe-style key":r"sk-[A-Za-z0-9_\-]{20,}",
  "GitHub token":r"ghp_[A-Za-z0-9]{30,}", "Password in value":r"(?i)(password|secret|token|api_key)\s*=\s*\S{6,}"}
@app.post("/env-audit")
def env_audit(b: Text):
    f=[{"type":k,"match":m.group(0)[:6]+"…"} for k,p in PATTERNS.items() for m in re.finditer(p,b.text)]
    return {"findings":f, "advice":chat("You are a security reviewer. Explain risks in this .env and how to fix them (.gitignore, rotate keys). Be brief.", b.text)}

class Feynman(BaseModel): note_id:int; explanation:str
@app.post("/feynman")
def feynman(b: Feynman):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.execute("SELECT text FROM notes WHERE id = ?", (b.note_id,))
        row = cursor.fetchone()
        
    note_text = row[0] if row else ""
    return {"feedback": chat("You are a Feynman-technique tutor. Compare the student's explanation to the source notes. Point out jargon, gaps, mistakes, then ask one follow-up question.\n\nNOTES:\n"+note_text, b.explanation)}