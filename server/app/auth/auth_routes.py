from fastapi import APIRouter, HTTPException, Depends
from app.auth.auth_models import User, LoginRequest
from app.auth.auth_utils import hash_password, verify_password, create_access_token
from app.auth.auth_config import user_collection
from pymongo.errors import DuplicateKeyError
from datetime import timedelta

auth_router = APIRouter()

# MongoDB index to ensure unique email
user_collection.create_index("email", unique=True)

@auth_router.post("/signup")
async def signup(user: User):
    hashed_password = hash_password(user.password)
    try:
        user_collection.insert_one({
            "username": user.username,
            "email": user.email,
            "password": hashed_password
        })
        return {"message": "User created successfully"}
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")

@auth_router.post("/login")
async def login(request: LoginRequest):
    user = user_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")
    
    # Generate JWT token
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}
