# 🌸 Random Acts of Kindness Wall

A full-stack web app where users share kind acts they did or witnessed. Others can react with ❤️. A live, uplifting feed of good deeds.

**Stack:** FastAPI · MongoDB Atlas · HTML/CSS/JS · Docker · Azure AKS

---

## 🗂️ Project Structure

```
kindness-wall/
├── backend/
│   ├── main.py               # FastAPI app + all API routes
│   ├── requirements.txt
│   └── .env                  # MONGODB_URI (not committed to git)
├── frontend/
│   ├── index.html            # Warm pastel UI
│   ├── style.css             # Light mode design
│   └── app.js                # Vanilla JS (fetch + heart animation)
├── k8s/
│   ├── deployment.yaml       # AKS Deployment (2 replicas)
│   └── service.yaml          # LoadBalancer (public IP on port 80)
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 📦 MongoDB Document (kindness_entries)

```json
{
  "_id": "ObjectId('...')",
  "name": "Sarah",
  "story": "I helped an elderly man carry his groceries to his car today.",
  "hearts": 12,
  "created_at": "2026-04-06T10:30:00Z"
}


## 📡 API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/` | Serve frontend |
| GET | `/api/kindness` | Fetch all entries (newest first) |
| POST | `/api/kindness` | Submit new entry `{ name, story }` |
| POST | `/api/kindness/{id}/heart` | Add a ❤️ reaction |
| DELETE | `/api/kindness/{id}` | Remove an entry |
| GET | `/api/health` | Health check |


