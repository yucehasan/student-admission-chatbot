from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

    
class Program(Base):
    __tablename__ = "program"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    
class Campus(Base):
    __tablename__ = "campus"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    
class CampusProgram(Base):
    __tablename__ = "campus_program"
    id = Column(Integer, primary_key=True, index=True)
    campus_id = Column(Integer, ForeignKey('campus.id'), index=True)
    program_id = Column(Integer, ForeignKey('program.id'), index=True)

    
class Chat(Base):
    __tablename__ = "chat"
    id = Column(String, primary_key=True, index=True)
    messages = Column(Text)
