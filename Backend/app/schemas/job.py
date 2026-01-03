from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    company: str
    role: str
    status: str
    notes: Optional[str] = None

class JobResponse(BaseModel):
    id: str
    company: str
    role: str
    status: str
    notes: str
