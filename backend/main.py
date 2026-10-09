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
def generate_id_svg(name, id_num, program):
    return f"""<svg width="100%" height="100%" viewBox="0 0 350 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0f172a" rx="15" ry="15"/>
      <rect x="20" y="20" width="60" height="60" fill="#1e293b" rx="30"/>
      <text x="50" y="55" fill="#38bdf8" font-size="24" font-weight="bold" text-anchor="middle">{name[0] if name else 'S'}</text>
      <text x="95" y="45" fill="#38bdf8" font-size="18" font-weight="bold">Stupidyante ID</text>
      <text x="95" y="65" fill="#94a3b8" font-size="12">Air-Gapped Validated</text>
      <line x1="20" y1="95" x2="330" y2="95" stroke="#1e293b" stroke-width="2"/>
      <text x="20" y="125" fill="#f8fafc" font-size="16" font-weight="600">{name or 'N/A'}</text>
      <text x="20" y="150" fill="#94a3b8" font-size="12">{program or 'N/A'}</text>
      <text x="20" y="175" fill="#38bdf8" font-size="14" font-family="monospace">{id_num or 'N/A'}</text>
    </svg>"""

class Subject(BaseModel): code:str; name:str; room:str; schedule:str
class COR(BaseModel): studentName:str; studentId:str; program:str; subjects:list[Subject]; id_card_svg:str = ""

@app.post("/cor")
def cor(b: Text):
    data = COR.model_validate_json(chat(
      "Extract student data from this Certificate of Registration. Empty string if missing. Do not invent data.",
      b.text, COR.model_json_schema()))
    data.id_card_svg = generate_id_svg(data.studentName, data.studentId, data.program)
    return data

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

class Flashcard(BaseModel): front:str; back:str
class Deck(BaseModel): cards:list[Flashcard]
@app.post("/quiz/{note_id}")
def quiz(note_id:int, count:int=5):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.execute("SELECT text FROM notes WHERE id = ?", (note_id,))
        row = cursor.fetchone()
        
    if not row:
        return {"error": "Note not found"}
        
    return Deck.model_validate_json(chat(
      f"Create {count} study flashcards (front and back) based ONLY on the note.",
      row[0], Deck.model_json_schema()))

class AuditItem(BaseModel): type:str; msg:str
class AuditLog(BaseModel): log:list[AuditItem]

PATTERNS = {"AWS key":r"AKIA[0-9A-Z]{16}", "OpenAI/Stripe-style key":r"sk-[A-Za-z0-9_\-]{20,}",
  "GitHub token":r"ghp_[A-Za-z0-9]{30,}", "Password in value":r"(?i)(password|secret|token|api_key)\s*=\s*\S{6,}"}
@app.post("/env-audit")
def env_audit(b: Text):
    f=[f"{k} found: {m.group(0)[:6]}…" for k,p in PATTERNS.items() for m in re.finditer(p,b.text)]
    context = f"Findings from regex: {f}\nRaw Env:\n{b.text}"
    return AuditLog.model_validate_json(chat(
        "You are a security reviewer. Audit the given env file and regex findings. Return an array of findings, setting type to 'danger' or 'warning', and msg explaining the risk and how to fix it.",
        context, AuditLog.model_json_schema())).log

class FeynmanFeedback(BaseModel): score:str; comment:str
class Feynman(BaseModel): note_id:int; explanation:str
@app.post("/feynman")
def feynman(b: Feynman):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.execute("SELECT text FROM notes WHERE id = ?", (b.note_id,))
        row = cursor.fetchone()
        
    note_text = row[0] if row else ""
    return FeynmanFeedback.model_validate_json(chat(
        "You are a Feynman-technique tutor. Critique the explanation against the source notes. Provide a percentage score (e.g. '85%') and a comment pointing out jargon/gaps.\n\nNOTES:\n"+note_text, 
        b.explanation, FeynmanFeedback.model_json_schema()))