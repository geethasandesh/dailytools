from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import onnxruntime as ort
import cv2
from PIL import Image
import io
import os

app = FastAPI(title="Image Background Remover API", version="1.0.0")

# Broad CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_CONFIGS = {
    'modnet': {
        'path': 'modnet_photographic_portrait_matting.onnx',
        'input_size': (512, 512)
    },
    'modnet_photographic': {
        'path': 'modnet_photographic_portrait_matting.onnx',
        'input_size': (512, 512)
    },
    'modnet_webcam': {
        'path': 'modnet_photographic_portrait_matting.onnx',  # Using same model for now
        'input_size': (512, 512)
    }
}

# Initialize model session
models_dir = os.path.join(os.path.dirname(__file__), "models")
default_model_path = os.path.join(models_dir, "modnet_photographic_portrait_matting.onnx")

if os.path.exists(default_model_path):
    session = ort.InferenceSession(default_model_path, providers=['CPUExecutionProvider'])
else:
    session = None
    print(f"Warning: Model file not found at {default_model_path}")

def preprocess(img: np.ndarray, input_size=(512, 512)) -> np.ndarray:
    """Preprocess image for model input"""
    try:
        # Convert BGR to RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # Resize to model input size
        img = cv2.resize(img, input_size)
        # Normalize to [0,1]
        img = img.astype(np.float32) / 255.0
        # Transpose to (1,3,H,W)
        img = np.transpose(img, (2, 0, 1))
        img = np.expand_dims(img, 0)
        return img
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")

def postprocess(alpha: np.ndarray, orig_shape, input_size=(512, 512)) -> np.ndarray:
    """Postprocess model output"""
    try:
        # alpha: (1,1,H,W) -> (H,W)
        alpha = alpha.squeeze()
        # Resize back to original size
        alpha = cv2.resize(alpha, (orig_shape[1], orig_shape[0]))
        # Convert to uint8
        alpha = (alpha * 255).astype(np.uint8)
        return alpha
    except Exception as e:
        raise ValueError(f"Error postprocessing alpha: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "MODNet Background Remover API is running!",
        "version": "1.0.0",
        "available_models": list(MODEL_CONFIGS.keys()),
        "model_loaded": session is not None
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": session is not None,
        "model_path": default_model_path if session else None,
        "available_models": list(MODEL_CONFIGS.keys())
    }

@app.post("/remove-background")
async def remove_background(
    file: UploadFile = File(...),
    model_type: str = Form("modnet"),
    output_format: str = Form("png"),
    quality: float = Form(0.9)
):
    """
    Remove background from uploaded image using MODNet model
    """
    try:
        # Validate inputs
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        if model_type not in MODEL_CONFIGS:
            raise HTTPException(status_code=400, detail=f"Invalid model type. Available: {list(MODEL_CONFIGS.keys())}")
        
        if output_format.lower() not in ['png', 'jpg', 'jpeg', 'webp']:
            raise HTTPException(status_code=400, detail="Invalid output format. Use: png, jpg, jpeg, webp")
        
        if not (0.1 <= quality <= 1.0):
            raise HTTPException(status_code=400, detail="Quality must be between 0.1 and 1.0")
        
        if session is None:
            raise HTTPException(status_code=500, detail="Model not loaded. Please check server logs.")
        
        # Read and validate image
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        try:
            img = Image.open(io.BytesIO(contents))
            img = img.convert("RGB")
            img_array = np.array(img)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
        
        orig_shape = img_array.shape[:2]
        model_config = MODEL_CONFIGS[model_type]
        
        # Preprocess
        input_tensor = preprocess(img_array, model_config['input_size'])
        
        # Run inference
        ort_inputs = {session.get_inputs()[0].name: input_tensor}
        ort_outs = session.run(None, ort_inputs)
        alpha = ort_outs[0]  # (1,1,512,512)
        
        # Postprocess
        matte = postprocess(alpha, orig_shape, model_config['input_size'])
        
        # Composite foreground with transparent background
        rgba = np.dstack([img_array, matte])
        out_img = Image.fromarray(rgba, mode="RGBA")
        
        # Convert to bytes based on output format
        buf = io.BytesIO()
        
        if output_format.lower() in ['jpg', 'jpeg']:
            # For JPG, create white background
            if out_img.mode == "RGBA":
                # Create white background
                white_bg = Image.new("RGB", out_img.size, (255, 255, 255))
                white_bg.paste(out_img, mask=out_img.split()[-1])  # Use alpha channel as mask
                out_img = white_bg
            
            # Save as JPG with quality setting
            out_img.save(buf, format='JPEG', quality=int(quality * 100))
            media_type = "image/jpeg"
        elif output_format.lower() == "webp":
            out_img.save(buf, format='WebP', quality=int(quality * 100))
            media_type = "image/webp"
        else:  # PNG
            out_img.save(buf, format='PNG')
            media_type = "image/png"
        
        buf.seek(0)
        return StreamingResponse(buf, media_type=media_type)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in /remove-background: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print(f"Starting MODNet Background Remover API...")
    print(f"Model path: {default_model_path}")
    print(f"Model loaded: {session is not None}")
    uvicorn.run(app, host="0.0.0.0", port=8000)