import React, { useEffect, useState } from 'react';
import { fetchUserBooks, getRecommendations } from '../services/api';
import '../components/styles/Home.css';

const Home = () => {
  const [userBooks, setUserBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setRecommendations(recs);
      } catch (err) {
        setError('Error fetching recommendations. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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
            <div className="book-cover">
              <span className="book-title">{rec}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
