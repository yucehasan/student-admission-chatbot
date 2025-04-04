from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
import json
import requests


from .socket import ConnectionManager

API_KEY = ""

router = APIRouter()
manager = ConnectionManager()

def respond_to_message(message):
    response = ""
    if message == "Connect":
        response = "Hello, how can I help you?"
    else:
        # API endpoint
        url = "https://pdf.ai/api/v1/chat-all"
        # Headers
        headers = {
            "X-API-Key": API_KEY,
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

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    # Create chat object
    now = datetime.now()
    current_time = now.strftime("%H:%M")
    try:
        while True:
            message = await websocket.receive_text()
            print(message)
            response = respond_to_message(message)
            res_obj = {"time": current_time, "clientId": "server", "message": f"{response}"}
            await manager.send_personal_message(json.dumps(res_obj), websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        
