from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
import json


from .socket import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

def respond_to_message(message):
    response = ""
    if message == "Connect":
        response = "Hello, how can I help you?"
    else:
        response = "I don't know yet"
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
        
