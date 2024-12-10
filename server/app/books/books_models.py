from pydantic import BaseModel, Field
from typing import Optional


class BookEntry(BaseModel):
    book_id: str
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    genre: str = Field(..., min_length=1)
    shelf: str = Field(..., pattern="^(TBR|Finished)$")  # TBR: To Be Read, Finished: Completed
    book_image: str

class BookResponse(BaseModel):
    book_id: str
    title: str
    description: str
    genre: str
    shelf: str
    book_image: str

class UserBooksResponse(BaseModel):
    books: list[BookResponse]

class UpdateShelfRequest(BaseModel):
    new_shelf: str = Field(..., pattern="^(TBR|Finished)$")