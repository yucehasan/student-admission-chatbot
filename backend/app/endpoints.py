import uuid
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from datetime import datetime
import json


from .socket import ConnectionManager
from .db import SessionLocal
from .models import Campus, Program, Chat
from sqlalchemy import select

router = APIRouter()
manager = ConnectionManager()

def respond_to_message(message):
    response = ""
    if message == "Connect":
        response = "Hello, how can I help you?"
    else:
        response = "I don't know yet"
    return response
    
async def generate_uuid(session):
    id = str(uuid.uuid4())
    # Check if id exists in chat table
    statement = select(Chat.id).where(Chat.id == id).limit(1)
    chat = (await session.execute(statement)).first()
    retry = 0
    while chat and retry < 10:
        id = str(uuid.uuid4())
        statement = select(Chat.id).where(Chat.id == id).limit(1)
        chat = (await session.execute(statement)).first()
        retry += 1
    return id if retry < 10 else None

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    # Create chat object
    session = SessionLocal()
    uid = await generate_uuid(session)
    chat = Chat(id=uid, messages="")
    session.add(chat)
    now = datetime.now()
    current_time = now.strftime("%H:%M")
    try:
        while True:
            message = await websocket.receive_text()
            response = respond_to_message(message)
            res_obj = {"time": current_time, "clientId": "server", "message": f"{response}", "chatId": uid}
            await manager.send_personal_message(json.dumps(res_obj), websocket)
            if message and message != "Connect":
                chat.messages += f"message: {message}\n"
            if response:
                chat.messages += f"response: {response}\n"
            
    except WebSocketDisconnect:
        await session.commit()
        manager.disconnect(websocket)
        
@router.get('/campuses')
async def test_posts():
    session = SessionLocal()
    # query for individual columns
    statement = select(Campus)

    # list of Row objects
    rows = (await session.execute(statement)).scalars().all()
    campuses = [row.__dict__ for row in rows]
    return campuses
        
@router.get('/programs')
async def test_posts():
    session = SessionLocal()

    statement = select(Program)
    rows = (await session.execute(statement)).scalars().all()
    campuses = [row.__dict__ for row in rows]
    return campuses


# @router.post('/', status_code=status.HTTP_201_CREATED, response_model=List[schemas.CreatePost])
# def test_posts_sent(post_post:schemas.CreatePost, db:Session = Depends(get_db)):

#     new_post = models.Post(**post_post.dict())
#     db.add(new_post)
#     db.commit()
#     db.refresh(new_post)

#     return [new_post]


# @router.get('/{id}', response_model=schemas.CreatePost, status_code=status.HTTP_200_OK)
# def get_test_one_post(id:int ,db:Session = Depends(get_db)):

#     idv_post = db.query(models.Post).filter(models.Post.id == id).first()

#     if idv_post is None:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {id} you requested for does not exist")
#     return idv_post

# @router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
# def delete_test_post(id:int, db:Session = Depends(get_db)):

#     deleted_post = db.query(models.Post).filter(models.Post.id == id)


#     if deleted_post.first() is None:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail=f"The id: {id} you requested for does not exist")
#     deleted_post.delete(synchronize_session=False)
#     db.commit()



# @router.put('/posts/{id}', response_model=schemas.CreatePost)
# def update_test_post(update_post:schemas.PostBase, id:int, db:Session = Depends(get_db)):

#     updated_post =  db.query(models.Post).filter(models.Post.id == id)

#     if updated_post.first() is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"The id:{id} does not exist")
#     updated_post.update(update_post.dict(), synchronize_session=False)
#     db.commit()


#     return  updated_post.first()