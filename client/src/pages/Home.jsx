import React, { useEffect, useState } from 'react';
import { fetchUserBooks, getRecommendations } from '../services/api';
import { searchBook } from '../services/googleBooks'; // Import the required functions
import { addToShelf } from '../services/api';
import '../components/styles/Home.css';

const Home = () => {
  const [userBooks, setUserBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const normalizeTitle = (title) =>
    title.replace(/[^a-z0-9]/gi, '').toLowerCase();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch user's books
        const { books } = await fetchUserBooks();
        setUserBooks(books);

        // Prepare books payload for recommendations
        const booksPayload = books.map((book) => ({
          title: book.title,
          description: book.description,
          genre: book.genre,
        }));

        // Fetch recommendations
        const { recommendations: recs } = await getRecommendations(booksPayload, 20);

        // Remove duplicate titles based on alphanumeric comparison
        const seen = new Set();
        const uniqueTitles = recs.filter((title) => {
          const normalizedTitle = normalizeTitle(title);
          if (seen.has(normalizedTitle)) {
            return false;
          }
          seen.add(normalizedTitle);
          return true;
        });

        console.log("Unique Recommendations: ", uniqueTitles);

        // Fetch book details (covers, etc.) from Google Books API
        const enhancedRecommendations = await Promise.all(
          uniqueTitles.map(async (recTitle) => {
            try {
              const results = await searchBook(recTitle); // Query Google Books API
              return results[0] || { title: recTitle }; // Fallback to title-only if no results
            } catch {
              return { title: recTitle }; // Fallback to title-only if API fails
            }
          })
        );

        setRecommendations(enhancedRecommendations.filter(Boolean)); // Remove undefined results
      } catch (err) {
        setError('Error fetching recommendations. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleAddToShelf = async (book, shelf) => {
    try {
      const payload = {
        book_id: book.id || book.title, // Use title as fallback ID
        title: book.title,
        description: book.description || 'No description available',
        genre: book.categories?.[0] || 'Unknown',
        shelf,
        book_image: book.coverImage || '', // Fallback to no image
      };

      console.log('Adding book to shelf:', payload);
      const response = await addToShelf(payload);
      setMessage(response.message);

      // Add to user's books locally
      setUserBooks((prevBooks) => [...prevBooks, payload]);
    } catch (error) {
      console.error('Error adding book to shelf:', error);
      setMessage('Error adding book to shelf.');
    }
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setMessage('');
  };

  const getBookShelf = (bookId) => {
    const book = userBooks.find((book) => book.book_id === bookId);
    return book ? book.shelf : null;
  };

  if (loading) {
    return <p>Loading recommendations...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="home">
      <h1>Your Recommendations</h1>
      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div key={index} className="book-card">
            {rec.coverImage ? (
              <img
                src={rec.coverImage}
                alt={rec.title}
                onClick={() => setSelectedBook(rec)}
              />
            ) : (
              <div
                className="placeholder-image"
                onClick={() => setSelectedBook(rec)}
              >
                <span>{rec.title}</span>
              </div>
            )}
            <h3>{rec.title}</h3>
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
            <p>
              <strong>Author(s):</strong>{' '}
              {selectedBook.authors?.join(', ') || 'Unknown'}
            </p>
            <p>
              <strong>Description:</strong>{' '}
              {selectedBook.description || 'No description available'}
            </p>
            <p>
              <strong>Page Count:</strong>{' '}
              {selectedBook.pageCount || 'Unknown'}
            </p>
            <p>
              <strong>Published Date:</strong>{' '}
              {selectedBook.publishedDate || 'Unknown'}
            </p>
            <p>
              <strong>Genre(s):</strong>{' '}
              {selectedBook.categories?.join(', ') || 'Unknown'}
            </p>
            {getBookShelf(selectedBook.id || selectedBook.title) ? (
              <p className="shelf-message">
                This book is already in your "{getBookShelf(selectedBook.id || selectedBook.title)}" shelf.
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

export default Home;
