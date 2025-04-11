from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import router as api_router
import time

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

@app.get("/api/healthcheck")
def Health():
    return "system is up and running"

@app.get("/api/load_test")
def Test():
    time.sleep(5) # simulate a long-running process
    return "Successful query execution"

app.include_router(api_router)