from fastapi import FastAPI
from app.routes import book_router

app = FastAPI()

# Include the API routes
app.include_router(book_router)

@app.get("/")
def home():
    return {"message": "Welcome to the Book Recommendation System"}
