from fastapi import APIRouter, Depends, HTTPException
from app.books.books_models import BookEntry, UserBooksResponse, UpdateShelfRequest
from app.books.books_utils import add_book_to_shelf, get_user_books, delete_book_from_shelf, update_book_shelf
from app.auth.auth_utils import get_current_user

books_router = APIRouter()

@books_router.post("/api/bookshelf", status_code=201)
def add_to_shelf(book: BookEntry, user_id: str = Depends(get_current_user)):
    """
    Add a book to the user's shelf.
    """
    try:
        add_book_to_shelf(user_id, book.dict())
        return {"message": f"Book '{book.title}' added to the {book.shelf} shelf."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to add the book to the shelf.")

@books_router.get("/api/bookshelf", response_model=UserBooksResponse)
def fetch_user_books(user_id: str = Depends(get_current_user)):
    """
    Fetch all books for the current user.
    """
    books = get_user_books(user_id)
    return {"books": books}

@books_router.delete("/api/bookshelf/{book_id}")
def remove_from_shelf(book_id: str, user_id: str = Depends(get_current_user)):
    """
    Remove a book from the user's shelf.
    """
    success = delete_book_from_shelf(user_id, book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found.")
    return {"message": "Book removed from the shelf."}

@books_router.put("/api/bookshelf/{book_id}/shelf")
def modify_shelf(book_id: str, request: UpdateShelfRequest, user_id: str = Depends(get_current_user)):
    """
    Modify the shelf of a book.
    """
    new_shelf = request.new_shelf
    success = update_book_shelf(user_id, book_id, new_shelf)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found or update failed.")
    return {"message": f"Book moved to '{new_shelf}' shelf."}