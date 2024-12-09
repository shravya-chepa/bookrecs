from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("book_recommendation")
bookshelf_collection = db.get_collection("bookshelf")

# Ensure indexes for efficient queries
bookshelf_collection.create_index("user_id")
bookshelf_collection.create_index([("user_id", 1), ("book_id", 1)], unique=True)
