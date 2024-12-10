from fastapi import FastAPI
from app.ml.ml_routes import ml_router
from app.auth.auth_routes import auth_router
from app.books.books_routes import books_router
from fastapi.middleware.cors import CORSMiddleware
from app.ml.ml_evaluate import evaluate_model
from app.ml.ml_preprocess import preprocess_dataset
from app.ml.ml_recommender import get_recommendations_for_new_book

import pandas as pd

app = FastAPI()



# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the dataset
books_df = pd.read_csv("data/books.csv")
books_df = preprocess_dataset(books_df)

# Run evaluation when the server starts
print("Running Model Evaluation...")
evaluate_model(books_df, get_recommendations_for_new_book)

# Include the API routes
app.include_router(ml_router)
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(books_router, tags=["Books"])

@app.get("/")
def home():
    return {"message": "Welcome to the Book Recommendation System"}
