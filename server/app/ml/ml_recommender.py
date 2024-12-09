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

def get_recommendations_for_new_book(title: str, description: str, genre: str, num_recommendations: int = 5):
    """
    Recommend books from the database for a new book input.
    """
    # Combine and clean input features
    input_features = clean_text(title) + " " + clean_text(description) + " " + clean_text(genre)
    
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

    # Combine all input book features into a single vector
    for book in books:
        input_features = clean_text(book.title) + " " + clean_text(book.description) + " " + clean_text(book.genre)
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
