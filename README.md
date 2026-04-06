# Random Acts of Kindness Wall

A full-stack web app where users share kind acts they did or witnessed. Others can react with ❤️. A live, uplifting feed of good deeds.

**Stack:** FastAPI · MongoDB Atlas · HTML/CSS/JS · Docker · Azure AKS

---

## 🗂️ Project Structure

```
kindness-wall/
├── backend/
│   ├── main.py              
│   ├── requirements.txt
│   └── .env                 
├── frontend/
│   ├── index.html            
│   ├── style.css        
│   └── app.js              
├── k8s/
│   ├── deployment.yaml      
│   └── service.yaml        
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




