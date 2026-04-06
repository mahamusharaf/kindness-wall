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
```

---

## 📡 API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/` | Serve frontend |
| GET | `/api/kindness` | Fetch all entries (newest first) |
| POST | `/api/kindness` | Submit new entry `{ name, story }` |
| POST | `/api/kindness/{id}/heart` | Add a ❤️ reaction |
| DELETE | `/api/kindness/{id}` | Remove an entry |
| GET | `/api/health` | Health check |

---

## 🚀 Part 1 — Run Locally

### Prerequisites
- Python 3.11+
- MongoDB (local or Atlas)

```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Set your MongoDB URI in backend/.env
#    MONGODB_URI=mongodb://localhost:27017
#    or Atlas:
#    MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/kindness_db

# 3. Start the server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000** 🌸

---

## 🐳 Part 2 — Docker

### Build & run locally

```bash
# Build
docker build -t YOUR_DOCKERHUB_USERNAME/kindness-wall:latest .

# Run (pass the Atlas URI as env var)
docker run -p 8000:8000 \
  -e MONGODB_URI="your_mongodb_uri_here" \
  YOUR_DOCKERHUB_USERNAME/kindness-wall:latest
```

Open **http://localhost:8000** to verify.

### Push to Docker Hub

```bash
docker login
docker push YOUR_DOCKERHUB_USERNAME/kindness-wall:latest
```

---

## ☁️ Part 3 — Azure Kubernetes Service (AKS)

### Step 1 — Create AKS Cluster (Azure Portal)
1. Go to [portal.azure.com](https://portal.azure.com) → **Kubernetes services** → **Create**
2. Choose Resource Group, Cluster Name, Region
3. Node count: **1** → **Review + Create**

### Step 2 — Connect kubectl

```bash
az aks get-credentials --resource-group <your-rg> --name <your-cluster>
```

### Step 3 — Create MongoDB Secret

```bash
kubectl create secret generic kindness-secret \
  --from-literal=mongodb-uri="YOUR_MONGODB_ATLAS_URI"
```

### Step 4 — Update image name

In `k8s/deployment.yaml`, replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username.

### Step 5 — Deploy

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Step 6 — Get public IP

```bash
kubectl get services
# Wait ~1-2 min for EXTERNAL-IP to appear
```

Open **http://EXTERNAL-IP** — your app is live! 🎉

---

## 🐙 Part 4 — GitHub

```bash
git init
git add .
git commit -m "Initial commit — Kindness Wall"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kindness-wall.git
git push -u origin main
```

---

## 📋 Submission Checklist

- [ ] GitHub Repository Link
- [ ] Docker Hub Image Link: `hub.docker.com/r/YOUR_USERNAME/kindness-wall`
- [ ] Azure App Public URL: `http://EXTERNAL-IP`
- [ ] Screenshots of Docker and AKS deployments
