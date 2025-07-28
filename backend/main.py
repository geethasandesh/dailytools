from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services import image_bg, yt_to_mp3

app = FastAPI(
    title="Daily Tools API",
    description="Backend API for Daily Tools application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers from services
app.include_router(image_bg.router, prefix="/api/v1", tags=["image-processing"])
app.include_router(yt_to_mp3.router, prefix="/api/v1", tags=["media-conversion"])

@app.get("/")
async def root():
    return {"message": "Daily Tools API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": ["image-background-removal", "youtube-to-mp3"]}
