from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import books, members, loans, auth

# 🔥 KLUCZOWE — import modeli
from app.models import member, book, loan

from sqlalchemy.ext.asyncio import AsyncEngine

async def init_models(engine: AsyncEngine):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(title="Library Management System")

@app.on_event("startup")
async def on_startup():
    await init_models(engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(members.router)
app.include_router(loans.router)

@app.get("/")
def root():
    return {"message": "Library API działa"}