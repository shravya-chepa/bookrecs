from pydantic import BaseModel, Field, validator

from pydantic import BaseModel, Field, validator

class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    password: str = Field(..., min_length=6)

    @validator("email")
    def validate_email(cls, value):
        if "@" not in value or "." not in value.split("@")[-1]:
            raise ValueError("Invalid email address")
        return value