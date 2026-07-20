from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    project_interested: Optional[str] = "THE VIEW"
    message: Optional[str] = None
    source: Optional[str] = "website"


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    project_interested: Optional[str] = "THE VIEW"
    message: Optional[str] = None
    source: Optional[str] = "website"
    created_at: str = Field(default_factory=now_iso)


class BrochureRequestCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr


class BrochureRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    created_at: str = Field(default_factory=now_iso)


class ChatMessage(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str


# ---------------------------------------------------------------------------
# Chatbot concierge
# ---------------------------------------------------------------------------
CONCIERGE_SYSTEM_PROMPT = """You are 'Aria', the digital concierge for THE VIEW, the flagship gated villa-plot community by Parvathi Infra Developers in Kadthal, Telangana, India.

Speak warmly, concisely and with refined luxury hospitality. Keep replies short (2-4 sentences) unless asked for detail. Never invent facts. If you don't know something (e.g. exact current pricing), politely offer to connect them with the sales team and encourage them to share their contact details or download the brochure.

VERIFIED PROJECT FACTS:
- Project: THE VIEW — "A Scenic Address for a Selective Few".
- Developer: Parvathi Infra Developers.
- Total extent: 3.6 Acres. 45 exclusive villa plots.
- Plot sizes: approx. 200 to 388 sq. yards. 100% Vastu-compliant layout.
- Location: Kadthal, near Srisailam Highway, Telangana.
- Approvals: TG RERA approved, HMDA, Clear Title.
- Connectivity: Srisailam Highway 1 min, Regional Ring Road 6 min, 6-Lane NH to Tirupati 15 min, Proposed 4th City & Amazon Data Center 25 min, Fab City 35 min, RGI Airport 45 min, Foxconn 50 min.
- Amenities: 2220 sqft elegant clubhouse, swimming pool & kids pool, amphitheatre, landscaped parks, children's play area, gazebos, party lawn, senior citizens area, granite seating, 24x7 security with CC cameras, street lights, 30ft CC roads.
- Infrastructure: water connection & plantation for each plot, underground drainage, underground water line, overhead tank, elegant entrance gate.
- Contact: infraparvathi@gmail.com. Office: Brindavan Colony, Ootapally Village, near Tondupally Toll Gate, Shamshabad, Telangana.

Always steer interested buyers toward booking a site visit or requesting the brochure. Do not discuss competitors negatively. If asked about price, say pricing is shared on request and offer to arrange a call."""


@api_router.get("/")
async def root():
    return {"message": "Parvathi Infra Developers API"}


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    logger.info(f"New lead captured: {lead.name} / {lead.phone}")
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads():
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Lead(**d) for d in docs]


@api_router.post("/brochure-request", response_model=BrochureRequest)
async def create_brochure_request(payload: BrochureRequestCreate):
    req = BrochureRequest(**payload.model_dump())
    await db.brochure_requests.insert_one(req.model_dump())
    # Also store as a lead for the sales pipeline
    lead = Lead(name=payload.name, phone=payload.phone, email=payload.email,
                source="brochure_download")
    await db.leads.insert_one(lead.model_dump())
    logger.info(f"Brochure request: {req.name} / {req.email}")
    return req


@api_router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatMessage):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    session_id = payload.session_id or str(uuid.uuid4())

    # Load prior history for this session and fold it into the system context
    history_docs = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(40)

    system_message = CONCIERGE_SYSTEM_PROMPT
    if history_docs:
        transcript = "\n".join(
            f"{'Visitor' if d['role'] == 'user' else 'Aria'}: {d['content']}"
            for d in history_docs
        )
        system_message += f"\n\nCONVERSATION SO FAR:\n{transcript}"

    chat_client = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system_message,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        reply_text = await chat_client.send_message(UserMessage(text=payload.message))
    except Exception as e:  # noqa: BLE001
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=502, detail="Concierge is unavailable right now.")

    reply_text = reply_text if isinstance(reply_text, str) else str(reply_text)

    await db.chat_messages.insert_many([
        {"id": str(uuid.uuid4()), "session_id": session_id, "role": "user",
         "content": payload.message, "created_at": now_iso()},
        {"id": str(uuid.uuid4()), "session_id": session_id, "role": "assistant",
         "content": reply_text, "created_at": now_iso()},
    ])

    return ChatResponse(session_id=session_id, reply=reply_text)


@api_router.get("/chat/{session_id}")
async def get_chat_history(session_id: str):
    docs = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(200)
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
