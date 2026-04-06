from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Random Acts of Kindness Wall API")

# CORS — allow all origins (needed for Docker / AKS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MongoDB Connection ──────────────────────────
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGODB_URI)
db = client["kindness_db"]
collection = db["kindness_entries"]

# ── Pydantic Models ─────────────────────────────
class KindnessIn(BaseModel):
    name: str
    story: str

def serialize(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "story": doc["story"],
        "hearts": doc.get("hearts", 0),
        "created_at": doc.get("created_at", ""),
    }

# ── API Routes ───────────────────────────────────

@app.get("/api/kindness")
def get_all_entries():
    """Fetch all kindness entries, newest first."""
    docs = list(collection.find().sort("created_at", -1))
    return [serialize(d) for d in docs]


@app.post("/api/kindness", status_code=201)
def create_entry(entry: KindnessIn):
    """Submit a new kind act."""
    name = entry.name.strip()
    story = entry.story.strip()
    if not name or not story:
        raise HTTPException(status_code=400, detail="Name and story are required.")
    if len(name) > 60:
        raise HTTPException(status_code=400, detail="Name must be under 60 characters.")
    if len(story) > 600:
        raise HTTPException(status_code=400, detail="Story must be under 600 characters.")

    doc = {
        "name": name,
        "story": story,
        "hearts": 0,
        "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    result = collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize(doc)


@app.post("/api/kindness/{entry_id}/heart", status_code=200)
def add_heart(entry_id: str):
    """Increment ❤️ count for an entry."""
    try:
        oid = ObjectId(entry_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid entry ID.")

    result = collection.find_one_and_update(
        {"_id": oid},
        {"$inc": {"hearts": 1}},
        return_document=True,
    )
    if result is None:
        raise HTTPException(status_code=404, detail="Entry not found.")
    return {"id": entry_id, "hearts": result["hearts"]}


@app.delete("/api/kindness/{entry_id}", status_code=200)
def delete_entry(entry_id: str):
    """Remove a kindness entry."""
    try:
        oid = ObjectId(entry_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid entry ID.")

    result = collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found.")
    return {"detail": "Entry removed."}


@app.get("/api/health")
def health():
    return {"status": "ok"}


app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    return FileResponse("frontend/index.html")
