import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import googleBooksApi from '../services/googleBooks';
import '../components/styles/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // For modal data
  const query = searchParams.get('query') || '';

  useEffect(() => {
    if (query) {
      googleBooksApi.searchBooks(query).then((results) => setBooks(results));
    }
  }, [query]);

  const handleAddToShelf = (book, shelf) => {
    console.log(`Add "${book.title}" to ${shelf} shelf`);
    // Implement your backend integration to save to MongoDB here.
  };

  const handleCloseModal = () => {
    setSelectedBook(null); // Close the modal
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
              onClick={() => setSelectedBook(book)} // Open modal with book data
            />
            <h3>{book.title}</h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBook && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>{selectedBook.title}</h2>
            <p><strong>Author(s):</strong> {selectedBook.authors.join(', ')}</p>
            <p><strong>Description:</strong> {selectedBook.description}</p>
            <p><strong>Page Count:</strong> {selectedBook.pageCount}</p>
            <p><strong>Published Date:</strong> {selectedBook.publishedDate}</p>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
