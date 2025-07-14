from fastapi import FastAPI
from services import image_bg, yt_to_mp3

app = FastAPI()

# Register routers from services
app.include_router(image_bg.router)
app.include_router(yt_to_mp3.router) 