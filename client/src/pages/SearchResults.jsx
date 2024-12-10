import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {searchBooks} from '../services/googleBooks';
import { addToShelf, fetchUserBooks } from '../services/api';
import '../components/styles/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]); // Store user's books
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');
  const query = searchParams.get('query') || '';

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

  useEffect(() => {
    if (query) {
      searchBooks(query)
        .then((results) => setBooks(results))
        .catch((err) => {
          console.error('Error fetching search results:', err);
          setMessage('Error fetching search results.');
        });
    }
  }, [query]);

  const getBookShelf = (bookId) => {
    const book = userBooks.find((book) => book.book_id === bookId);
    return book ? book.shelf : null;
  };

  const handleAddToShelf = async (book, shelf) => {
    try {
      const payload = {
        book_id: book.id,
        title: book.title,
        description: book.description,
        genre: book.categories?.[0] || 'Unknown',
        shelf,
        book_image: book.coverImage
      };

      console.log('Sending payload to backend:', payload);

      const response = await addToShelf(payload);
      setMessage(response.message);

      // Update user's books after adding
      setUserBooks((prevBooks) => [...prevBooks, payload]);
    } catch (error) {
      console.error('Error adding book to shelf:', error.response || error);
      setMessage(error.response?.data?.detail || 'Error adding book to shelf');
    }
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setMessage('');
  };

  return (
    <div className="search-results">
      <h1>Search Results for "{query}"</h1>
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img
              src={book.coverImage}
              alt={book.title}
              onClick={() => setSelectedBook(book)}
            />
            <h3>{book.title}</h3>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>{selectedBook.title}</h2>
            <p><strong>Author(s):</strong> {selectedBook.authors.join(', ')}</p>
            <p><strong>Description:</strong> {selectedBook.description}</p>
            <p><strong>Page Count:</strong> {selectedBook.pageCount}</p>
            <p><strong>Published Date:</strong> {selectedBook.publishedDate}</p>
            <p><strong>Genre(s):</strong> {selectedBook.categories.join(', ')}</p>
            {getBookShelf(selectedBook.id) ? (
              <p className="shelf-message">
                This book is already in your "{getBookShelf(selectedBook.id)}" shelf.
              </p>
            ) : (
              <>
                <button
                  onClick={() => handleAddToShelf(selectedBook, 'TBR')}
                  className="add-to-shelf-btn"
                >
                  Add to TBR
                </button>
                <button
                  onClick={() => handleAddToShelf(selectedBook, 'Finished')}
                  className="add-to-shelf-btn"
                >
                  Add to Finished
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default SearchResults;
