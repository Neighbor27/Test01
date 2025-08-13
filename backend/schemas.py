# schemas.py

from pydantic import BaseModel

# 회원가입 시 받을 데이터 모양
class UserCreate(BaseModel):
    email: str
    password: str

# 회원가입 성공 후 응답으로 보내줄 데이터 모양 (비밀번호는 제외)
class User(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True