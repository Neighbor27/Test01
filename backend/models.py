# models.py (수정본)

from sqlalchemy import Column, Integer, String
# ▼▼▼ '.' 을 삭제했습니다 ▼▼▼
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)