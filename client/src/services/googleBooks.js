import axios from 'axios';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY

const searchBooks = async (query) => {
  const { data } = await axios.get(GOOGLE_BOOKS_API, {
    params: {
      q: query,
      maxResults: 5,
      key: API_KEY,
    },
  });

  console.log("data: ", data)

  return data.items.map((item) => ({
    id: item.id,
    title: item.volumeInfo.title,
    description: item.volumeInfo.description || 'No description available',
    coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
    authors: item.volumeInfo.authors || ['Unknown Author'],
    publishedDate: item.volumeInfo.publishedDate || 'Unknown',
    pageCount: item.volumeInfo.pageCount || "Unknown",
    categories: item.volumeInfo.categories || ["Unknown"]
  }));
};

const searchBook = async (query) => {
  const { data } = await axios.get(GOOGLE_BOOKS_API, {
    params: {
      q: query,
      maxResults: 1,
      key: API_KEY,
    },
  });

  console.log("data: ", data)

  return data.items.map((item) => ({
    id: item.id,
    title: item.volumeInfo.title,
    description: item.volumeInfo.description || 'No description available',
    coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
    authors: item.volumeInfo.authors || ['Unknown Author'],
    publishedDate: item.volumeInfo.publishedDate || 'Unknown',
    pageCount: item.volumeInfo.pageCount || "Unknown",
    categories: item.volumeInfo.categories || ["Unknown"]
  }));
};

export { searchBooks, searchBook };
