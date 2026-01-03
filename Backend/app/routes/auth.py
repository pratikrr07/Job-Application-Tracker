from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

"""
Authentication Routes Module

Handles user registration, login, and JWT token generation.
Passwords are hashed using bcrypt before storage.
JWT tokens expire after 30 days by default.
"""

load_dotenv()

from app.database import user_collection
from app.schemas.user import UserCreate, UserLogin

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

@router.post("/signup", status_code=201)
def signup(user: UserCreate):
    """
    Register a new user account.
    
    Args:
        user: UserCreate object with email and password
        
    Returns:
        Success message with user email
        
    Raises:
        HTTPException: 400 if email already exists
    """
    try:
        # Check if user already exists
        existing_user = user_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Truncate password to 72 bytes (bcrypt limit) and hash
        password_truncated = user.password[:72]
        hashed_password = pwd_context.hash(password_truncated)
        
        # Create new user document
        new_user = {
            "email": user.email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }
        
        # Insert into database
        result = user_collection.insert_one(new_user)
        
        return {
            "id": str(result.inserted_id),
            "email": user.email,
            "message": "User created successfully"
        }
    except Exception as e:
        print(f"Signup Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login(user: UserLogin):
    """
    Authenticate user and generate JWT token.
    
    Args:
        user: UserLogin object with email and password
        
    Returns:
        Dict with access_token and token_type
        
    Raises:
        HTTPException: 401 if credentials are invalid
    """
    try:
        # Find user by email
        db_user = user_collection.find_one({"email": user.email})
        
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Truncate password to 72 bytes to match signup
        password_truncated = user.password[:72]
        if not pwd_context.verify(password_truncated, db_user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create JWT token
        payload = {
            "sub": user.email,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "access_token": token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
