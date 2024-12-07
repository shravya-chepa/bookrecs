# Book Recommendation System

## How to Run the Server

### Step 1: Clone the Repository
Clone the repository to your local machine:

```bash
git clone <repository_url>
cd bookrecs/server
```

### Step 2: Set Up a Virtual Environment
```bash
python -m venv env
source env/bin/activate  # On macOS/Linux
env\Scripts\activate     # On Windows
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the FastAPI server
```bash
uvicorn app.main:app --reload
```

### Endpoints
**Endpoint 1: /recommendations** \
Method: POST

Request Example
```json
{
    "title": "Lord of the Rings",
    "description": "The Lord of the Rings by J.R.R. Tolkien tells the story of the War of the Ring in the fictional world of Middle-earth. The long novel, commonly published as three volumes and mistakenly called a trilogy, centers around the magical One Ring, which was discovered by Bilbo Baggins in the earlier novel The Hobbit.",
    "genre": "Fantasy Fiction, Adventure, Heroic",
    "num_recommendations": 20
}
```

**Endpoint2: /recommendations/multiple** \
Method: POST

Request Example
```json
{
    "books": [
        {
            "title": "Journey Through Heartsongs",
            "description": "A heartfelt collection of poems.",
            "genre": "Poetry"
        },
        {
            "title": "In Search of Melancholy Baby",
            "description": "A Russian author's chronicle of life in the US.",
            "genre": "Biography"
        }
    ],
    "num_recommendations": 20
}
```