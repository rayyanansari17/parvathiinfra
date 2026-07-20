"""Backend API tests for Parvathi Infra Developers / THE VIEW site."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://the-view-luxury.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health ------------------------------------------------------------------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        body = r.json()
        assert "Parvathi Infra Developers" in body.get("message", "")


# --- Leads -------------------------------------------------------------------
class TestLeads:
    def test_create_lead_and_list_contains_it(self, client):
        unique = f"TEST_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": f"Test User {unique}",
            "phone": "+919999999999",
            "email": f"{unique}@example.com",
            "message": "Interested in THE VIEW",
            "source": "automated_test",
        }
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        lead = r.json()
        assert lead["name"] == payload["name"]
        assert lead["phone"] == payload["phone"]
        assert lead["email"] == payload["email"]
        assert lead["source"] == "automated_test"
        assert "id" in lead and isinstance(lead["id"], str)
        assert "created_at" in lead

        # List and confirm persistence
        lr = client.get(f"{API}/leads")
        assert lr.status_code == 200
        arr = lr.json()
        assert isinstance(arr, list)
        assert any(l.get("id") == lead["id"] for l in arr), "Newly created lead not present in GET /api/leads"

    def test_create_lead_minimal(self, client):
        payload = {"name": "TEST_min", "phone": "+911111111111"}
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["project_interested"] == "THE VIEW"
        assert data["source"] == "website"


# --- Brochure ----------------------------------------------------------------
class TestBrochure:
    def test_brochure_request_creates_lead(self, client):
        unique = f"TEST_broch_{uuid.uuid4().hex[:8]}"
        payload = {"name": unique, "phone": "+918888888888", "email": f"{unique}@example.com"}
        r = client.post(f"{API}/brochure-request", json=payload)
        assert r.status_code == 200, r.text
        b = r.json()
        assert b["name"] == unique
        assert b["email"] == payload["email"]
        assert "id" in b

        # Verify a lead was also created (source=brochure_download)
        lr = client.get(f"{API}/leads")
        assert lr.status_code == 200
        arr = lr.json()
        matches = [l for l in arr if l.get("name") == unique and l.get("source") == "brochure_download"]
        assert matches, "Brochure request did not also produce a lead with source=brochure_download"

    def test_brochure_invalid_email(self, client):
        payload = {"name": "TEST_bad", "phone": "+911", "email": "not-an-email"}
        r = client.post(f"{API}/brochure-request", json=payload)
        assert r.status_code == 422


# --- Chat --------------------------------------------------------------------
class TestChat:
    SESSION_ID = f"sess-test-{uuid.uuid4().hex[:6]}"

    def test_chat_reply_mentions_plots(self, client):
        payload = {"session_id": self.SESSION_ID, "message": "What are the plot sizes at THE VIEW?"}
        r = client.post(f"{API}/chat", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["session_id"] == self.SESSION_ID
        assert isinstance(data["reply"], str) and len(data["reply"]) > 0
        lower = data["reply"].lower()
        # Reply should reference plots/sizes/sq. yards
        assert any(k in lower for k in ["plot", "yard", "sq", "size", "200", "388"]), \
            f"Reply did not mention plot/sizes: {data['reply'][:200]}"

    def test_chat_followup_has_context(self, client):
        follow = {"session_id": self.SESSION_ID, "message": "And what about the amenities?"}
        r = client.post(f"{API}/chat", json=follow, timeout=60)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data["reply"], str) and len(data["reply"]) > 0

    def test_chat_history(self, client):
        # Give DB a moment
        time.sleep(0.5)
        r = client.get(f"{API}/chat/{self.SESSION_ID}")
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        # 2 turns => 4 entries
        assert len(arr) >= 4, f"Expected >=4 history entries, got {len(arr)}"
        roles = [m.get("role") for m in arr]
        assert "user" in roles and "assistant" in roles
