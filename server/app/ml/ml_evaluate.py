import random

def evaluate_model(books_df, recommender_function, num_samples=50, num_recommendations=5):
    """
    Evaluate the recommendation model using precision, recall, and F1-score.
    :param books_df: The dataset of books.
    :param recommender_function: The function to generate recommendations.
    :param num_samples: Number of random books to sample for evaluation.
    :param num_recommendations: Number of recommendations to generate.
    """
    # Select random books for evaluation
    sampled_books = books_df.sample(n=min(num_samples, len(books_df)))

    # Initialize metrics
    precision_scores = []
    recall_scores = []

    for _, book in sampled_books.iterrows():
        title, description, genre = book["Title"], book["Description"], book["Category"]
        actual_similar_books = set(
            books_df[
                (books_df["Category"] == book["Category"]) &
                (books_df["Title"] != book["Title"])
            ]["OriginalTitle"]
        )
        
        recommendations = recommender_function(
            title=title,
            description=description,
            genre=genre,
            num_recommendations=num_recommendations 
        )

        relevant_recommendations = set(recommendations) & actual_similar_books

        # Precision: Proportion of recommended books that are relevant
        precision = len(relevant_recommendations) / len(recommendations) if recommendations else 0
        precision_scores.append(precision)

        # Recall: Proportion of relevant books that were recommended
        recall = len(relevant_recommendations) / len(actual_similar_books) if actual_similar_books else 0
        recall_scores.append(recall)

    # Calculate average metrics
    avg_precision = sum(precision_scores) / len(precision_scores)
    avg_recall = sum(recall_scores) / len(recall_scores)
    f1_score = 2 * (avg_precision * avg_recall) / (avg_precision + avg_recall) if (avg_precision + avg_recall) > 0 else 0

    # Print metrics
    print("\nModel Evaluation Metrics:")
    print(f"Precision: {avg_precision:.2f}")
    print(f"Recall: {avg_recall:.2f}")
    print(f"F1-Score: {f1_score:.2f}")

    return avg_precision, avg_recall, f1_score
