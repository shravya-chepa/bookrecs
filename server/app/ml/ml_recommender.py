import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.ml.ml_preprocess import preprocess_dataset, clean_text

# Load the dataset
books_df = pd.read_csv("data/books.csv")

# Preprocess the data (combine relevant features)
books_df = preprocess_dataset(books_df)

# Fit TF-IDF Vectorizer
vectorizer = TfidfVectorizer(stop_words="english", max_features=10000)
tfidf_matrix = vectorizer.fit_transform(books_df["features"])

# Define weights for the features
TITLE_WEIGHT = 0.5
DESCRIPTION_WEIGHT = 1.0
GENRE_WEIGHT = 0.8

def apply_weighted_features(title: str, description: str, genre: str) -> str:
    """
    Combine features with weights applied as repetition.
    """
    weighted_title = (clean_text(title) + " ") * int(TITLE_WEIGHT * 10)
    weighted_description = (clean_text(description) + " ") * int(DESCRIPTION_WEIGHT * 10)
    weighted_genre = (clean_text(genre) + " ") * int(GENRE_WEIGHT * 10)
    
    return weighted_title + weighted_description + weighted_genre

def get_recommendations_for_new_book(title: str, description: str, genre: str, num_recommendations: int = 5):
    """
    Recommend books from the database for a new book input.
    """
    # Combine and clean input features with weights
    input_features = apply_weighted_features(title, description, genre)
    
    # Vectorize the input features
    input_vector = vectorizer.transform([input_features])
    
    # Compute similarity scores
    cosine_sim = cosine_similarity(input_vector, tfidf_matrix).flatten()
    
    # Get the top recommendations
    similar_indices = cosine_sim.argsort()[-num_recommendations:][::-1]
    
    # Return the original book titles
    return books_df.iloc[similar_indices]["OriginalTitle"].tolist()

def get_recommendations_for_multiple_books(books: list, num_recommendations: int = 5):
    """
    Recommend books based on multiple books provided.
    """
    combined_vector = None

    # Combine all input book features into a single weighted vector
    for book in books:
        input_features = apply_weighted_features(book.title, book.description, book.genre)
        input_vector = vectorizer.transform([input_features])
        if combined_vector is None:
            combined_vector = input_vector
        else:
            combined_vector += input_vector

    # Compute similarity scores
    cosine_sim = cosine_similarity(combined_vector, tfidf_matrix).flatten()
    
    # Get the top recommendations
    similar_indices = cosine_sim.argsort()[-num_recommendations:][::-1]
    
    # Return the original book titles
    return books_df.iloc[similar_indices]["OriginalTitle"].tolist()
