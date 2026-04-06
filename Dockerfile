# ── Build Stage ────────────────────────────────
FROM python:3.11-slim

LABEL maintainer="kindness-wall"
LABEL description="Random Acts of Kindness Wall — FastAPI + MongoDB + HTML/CSS/JS"

WORKDIR /app

# Install dependencies first (layer caching)
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY backend/  ./backend/
COPY frontend/ ./frontend/

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')"

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
