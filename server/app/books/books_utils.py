from bson import ObjectId
from app.books.books_config import bookshelf_collection

def add_book_to_shelf(user_id: str, book_data: dict):
    """
    Add a book to the user's shelf.
    """
    book_data["user_id"] = user_id
    bookshelf_collection.insert_one(book_data)

def get_user_books(user_id: str):
    """
    Fetch all books for a specific user.
    """
    books = list(bookshelf_collection.find({"user_id": user_id}))
    for book in books:
        book["_id"] = str(book["_id"])  # Convert ObjectId to string
    return books

def delete_book_from_shelf(user_id: str, book_id: str):
    """
    Remove a book from the user's shelf.
    """
    result = bookshelf_collection.delete_one({"user_id": user_id, "book_id": book_id})
    return result.deleted_count > 0  # Returns True if a document was deleted

def update_book_shelf(user_id: str, book_id: str, new_shelf: str):
    """
    Update the shelf of a book for a specific user.
    """
    print("Book ID:", book_id, "New shelf:", new_shelf)
    result = bookshelf_collection.update_one(
        {"user_id": user_id, "book_id": book_id},  # Find the book by user ID and book ID
        {"$set": {"shelf": new_shelf}}  # Update the shelf field
    )
    return result.modified_count > 0  # Returns True if a document was updated
