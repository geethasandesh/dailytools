from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
import io
from PIL import Image
from fastapi.responses import StreamingResponse

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    try:
        # Read the uploaded file
        input_image = Image.open(io.BytesIO(await file.read()))
        
        # Remove background using rembg
        output_image = remove(input_image)
        
        # Convert to bytes
        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format='PNG')
        output_buffer.seek(0)
        
        return StreamingResponse(
            output_buffer, 
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=background_removed.png"}
        )
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Background Remover API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 