from fastapi import APIRouter
from app.ml.ml_models import BookRequest, RecommendationResponse, MultipleBooksRequest
from app.ml.ml_recommender import get_recommendations_for_new_book, get_recommendations_for_multiple_books


ml_router = APIRouter()

@ml_router.post("/recommendations", response_model=RecommendationResponse)
def recommend_for_new_book(request: BookRequest):
    recommendations = get_recommendations_for_new_book(
        title=request.title,
        description=request.description,
        genre=request.genre,
        num_recommendations=request.num_recommendations
    )
    return {
        "input_books": [request.title],
        "recommendations": recommendations
    }

@ml_router.post("/recommendations/multiple", response_model=RecommendationResponse)
def recommend_for_multiple_books(request: MultipleBooksRequest):
    recommendations = get_recommendations_for_multiple_books(
        books=request.books,
        num_recommendations=request.num_recommendations
    )
    return {
        "input_books": [book.title for book in request.books],
        "recommendations": recommendations
    }
