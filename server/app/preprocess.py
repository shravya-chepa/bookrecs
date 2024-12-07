import re
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')
STOPWORDS = set(stopwords.words('english'))

def clean_text(text):
    """
    Clean text data by removing special characters, HTML tags, and stopwords.
    """
    if not isinstance(text, str):
        return ""  # Return empty string for non-string values
    
    text = re.sub(r"<[^>]*>", "", text)  # Remove HTML tags
    text = re.sub(r"[^a-zA-Z\s]", "", text)  # Remove non-alphabetic characters
    text = text.lower()
    text = " ".join(word for word in text.split() if word not in STOPWORDS)
    return text


def preprocess_dataset(df):
    """
    Apply cleaning to the title, description, and category (genre) columns.
    """
    # Preserve original titles
    df["OriginalTitle"] = df["Title"]

    # Replace NaN values with empty strings
    df["Title"] = df["Title"].fillna("")
    df["Description"] = df["Description"].fillna("")
    df["Category"] = df["Category"].fillna("")
    
    # Apply text cleaning
    df["Title"] = df["Title"].apply(clean_text)
    df["Description"] = df["Description"].apply(clean_text)
    df["Category"] = df["Category"].apply(clean_text)
    
    # Combine into a "features" column
    df["features"] = df["Title"] + " " + df["Description"] + " " + df["Category"]
    return df


