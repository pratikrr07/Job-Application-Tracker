from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, jobs

app = FastAPI(title="Job Application Tracker API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])

@app.get("/")
def root():
    return {"message": "Job Tracker API is running"}
