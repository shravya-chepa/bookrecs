import React, { useEffect, useState } from 'react';
import { fetchUserBooks, removeFromShelf, updateShelf } from '../services/api';

import '../components/styles/MyShelf.css';


const MyShelf = () => {
  const [userBooks, setUserBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetchUserBooks();
        setUserBooks(response.books);
      } catch (error) {
        console.error('Error fetching user books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleMoveToShelf = async (bookId, newShelf) => {
    try {
      console.log("Book ID:", bookId, "New shelf:", newShelf);
      const response = await updateShelf(bookId, newShelf); // Use the updated API
      setUserBooks((prevBooks) =>
        prevBooks.map((b) =>
          b.book_id === bookId ? { ...b, shelf: newShelf } : b
        )
      );
      setMessage(response.message);
      handleCloseModal();
    } catch (error) {
      console.error('Error moving book to new shelf:', error);
      setMessage('Failed to move book. Try again.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await removeFromShelf(bookId);
      setUserBooks((prevBooks) =>
        prevBooks.filter((book) => book.book_id !== bookId)
      );
      setMessage('Book deleted successfully.');
      setSelectedBook(null);
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting book:', error);
      setMessage('Failed to delete book. Try again.');
    }
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setMessage('');
  };

  const renderBooks = (shelf) => (
    <div className="book-list">
      {userBooks
        .filter((book) => book.shelf === shelf)
        .map((book) => (
          <div key={book.book_id} className="book-card">
            {book.book_image ? (
              <img
                src={book.book_image}
                alt={book.title}
                onClick={() => setSelectedBook(book)}
              />
            ) : (
              <div className="placeholder-image" onClick={() => setSelectedBook(book)}>
                No Image
              </div>
            )}
            <h3>{book.title}</h3>
          </div>
        ))}
    </div>
  );

  return (
    <div className="my-shelf">
      <h1>My Shelf</h1>
      <h2>TBR</h2>
      {renderBooks('TBR')}
      <h2 className='h2-finished'>Finished</h2>
      {renderBooks('Finished')}

      {selectedBook && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>{selectedBook.title}</h2>
            <p><strong>Description:</strong> {selectedBook.description}</p>
            <p><strong>Genre:</strong> {selectedBook.genre}</p>
            {selectedBook.shelf === 'TBR' ? (
              <button
                onClick={() => handleMoveToShelf(selectedBook.book_id, 'Finished')}
                className="add-to-shelf-btn"
              >
                Move to Finished
              </button>
            ) : (
              <button
                onClick={() => handleMoveToShelf(selectedBook.book_id, 'TBR')}
                className="add-to-shelf-btn"
              >
                Move to TBR
              </button>
            )}
            <button
              onClick={() => handleDeleteBook(selectedBook.book_id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default MyShelf;
