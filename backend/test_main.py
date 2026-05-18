from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)

# Mock MongoDB so tests don't need a real DB
@patch("main.collection")
def test_health_check(mock_col):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@patch("main.collection")
def test_get_entries_returns_list(mock_col):
    mock_col.find.return_value.sort.return_value = []
    response = client.get("/api/kindness")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@patch("main.collection")
def test_create_entry_validation(mock_col):
    # empty name should fail
    response = client.post("/api/kindness", json={"name": "", "story": "test"})
    assert response.status_code == 400