from fastapi import APIRouter, Depends, HTTPException, status
from app.database import job_collection
from app.schemas.job import JobCreate
from app.routes.deps import get_current_user
from datetime import datetime
from bson.objectid import ObjectId

"""
Job Application Routes Module

Provides CRUD operations for job applications.
All endpoints require authentication via JWT token.
Supports filtering, statistics, and bulk operations.
"""

router = APIRouter()

@router.post("/", status_code=201)
def create_job(
    job: JobCreate,
    user_token: str = Depends(get_current_user)
):
    new_job = {
        "company": job.company,
        "role": job.role,
        "status": job.status,
        "notes": job.notes or "",
        "user_token": user_token,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = job_collection.insert_one(new_job)
    return {
        "id": str(result.inserted_id),
        "message": "Job created successfully"
    }

@router.get("/")
def get_jobs(user_token: str = Depends(get_current_user)):
    jobs = []
    for job in job_collection.find({"user_token": user_token}).sort("created_at", -1):
        job["_id"] = str(job["_id"])
        jobs.append(job)
    return jobs

@router.get("/stats")
def get_stats(user_token: str = Depends(get_current_user)):
    jobs = list(job_collection.find({"user_token": user_token}))
    
    total = len(jobs)
    by_status = {}
    for job in jobs:
        status = job.get("status", "Unknown")
        by_status[status] = by_status.get(status, 0) + 1
    
    return {
        "total": total,
        "by_status": by_status,
        "applied": by_status.get("Applied", 0),
        "interviews": by_status.get("Interview", 0),
        "offers": by_status.get("Offer", 0),
        "rejected": by_status.get("Rejected", 0),
        "accepted": by_status.get("Accepted", 0)
    }

@router.put("/{job_id}")
def update_job(
    job_id: str,
    job: JobCreate,
    user_token: str = Depends(get_current_user)
):
    try:
        object_id = ObjectId(job_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    existing_job = job_collection.find_one({"_id": object_id, "user_token": user_token})
    if not existing_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    updated_job = {
        "company": job.company,
        "role": job.role,
        "status": job.status,
        "notes": job.notes or "",
        "updated_at": datetime.utcnow()
    }
    
    job_collection.update_one(
        {"_id": object_id},
        {"$set": updated_job}
    )
    
    return {
        "id": str(object_id),
        "message": "Job updated successfully"
    }

@router.delete("/{job_id}")
def delete_job(
    job_id: str,
    user_token: str = Depends(get_current_user)
):
    try:
        object_id = ObjectId(job_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    result = job_collection.delete_one({"_id": object_id, "user_token": user_token})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job deleted successfully"}
