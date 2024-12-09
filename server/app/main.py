from fastapi import FastAPI
from app.routes import book_router
from app.auth.auth_routes import auth_router

app = FastAPI()

# Include the API routes
app.include_router(book_router)
app.include_router(auth_router, prefix="/auth", tags=["Auth"])

@app.get("/")
def home():
    return {"message": "Welcome to the Book Recommendation System"}
