from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import router as websocket_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def Home():
    return "Welcome home"

app.include_router(websocket_router)