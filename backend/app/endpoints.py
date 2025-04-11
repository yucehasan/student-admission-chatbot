from fastapi import APIRouter
import requests
from pydantic import BaseModel
import os

router = APIRouter()
api_url = os.getenv("API_URL")
api_key = os.getenv("API_KEY")


class ChatMessage(BaseModel):
    message: str

def respond_to_message(message):
    response = ""
    if message == "Connect":
        response = "Hello, how can I help you?"
    else:
        # API endpoint
        url = api_url + "/chat-all"
        # Headers
        headers = {
            "X-API-Key": api_key,
            "Content-Type": "application/json"
        }
        # Request body
        data = {
            "save_chat": False,
            "message": message,  # Your question
            "use_gpt4": False,  # Set to True to use GPT-4 model
            "model": "gpt-3.5-turbo",  # Choose between "gpt-4o" or "gpt-4-turbo"
            "language": "english",  # Change to preferred language
        }

        # Make the POST request
        res = requests.post(url, json=data, headers=headers)
        response = dict(res.json()).get("content", "No response")
        
        
    return response

@router.post("/api/chat")
async def respond_to_chat(chat: ChatMessage):
    message = respond_to_message(chat.message)
    return {"status": "ok", "message": message}
