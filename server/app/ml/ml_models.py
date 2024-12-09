from pydantic import BaseModel
from typing import List


class RecommendationResponse(BaseModel):
    input_books: List[str]
    recommendations: List[str]

class BookRequest(BaseModel):
    title: str
    description: str
    genre: str
    num_recommendations: int = 5

class MultipleBooksRequest(BaseModel):
    books: List[BookRequest]
    num_recommendations: int = 5
