from fastapi import FastAPI
from app.ml.ml_routes import ml_router
from app.auth.auth_routes import auth_router
from app.books.books_routes import books_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API routes
app.include_router(ml_router)
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(books_router, tags=["Books"])

@app.get("/")
def home():
    return {"message": "Welcome to the Book Recommendation System"}
