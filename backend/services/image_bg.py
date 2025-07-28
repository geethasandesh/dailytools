from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import StreamingResponse
from rembg import remove, new_session
from PIL import Image
import io
import logging
from typing import Optional

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Available models for different use cases
MODELS = {
    "u2net": "u2net",  # General purpose, good for most images
    "u2net_human_seg": "u2net_human_seg",  # Optimized for human portraits
    "u2net_cloth_seg": "u2net_cloth_seg",  # For clothing items
    "silueta": "silueta",  # Fast but less accurate
    "isnet-general-use": "isnet-general-use",  # Good general purpose
    "isnet-anime": "isnet-anime",  # Optimized for anime/cartoon images
}

def validate_image(image_data: bytes) -> tuple[bool, str]:
    """Validate uploaded image"""
    try:
        image = Image.open(io.BytesIO(image_data))
        
        # Check file size (max 10MB)
        if len(image_data) > 10 * 1024 * 1024:
            return False, "Image size must be less than 10MB"
        
        # Check dimensions
        if image.width > 4000 or image.height > 4000:
            return False, "Image dimensions must be less than 4000x4000 pixels"
        
        # Check format
        if image.format not in ['JPEG', 'JPG', 'PNG', 'WEBP']:
            return False, "Only JPEG, PNG, and WEBP formats are supported"
        
        return True, "Valid image"
    except Exception as e:
        logger.error(f"Image validation error: {e}")
        return False, "Invalid image file"

def optimize_image(image_data: bytes, max_size: int = 2048) -> bytes:
    """Optimize image for processing"""
    try:
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode in ('RGBA', 'LA', 'P'):
            image = image.convert('RGB')
        
        # Resize if too large for optimal processing
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = (int(image.width * ratio), int(image.height * ratio))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Save optimized image
        output = io.BytesIO()
        image.save(output, format='PNG', optimize=True)
        return output.getvalue()
    except Exception as e:
        logger.error(f"Image optimization error: {e}")
        return image_data

@router.post('/remove-background')
async def remove_bg(
    file: UploadFile = File(...),
    model: str = Form("u2net"),
    post_process: bool = Form(True),
    alpha_matting: bool = Form(False),
    alpha_matting_foreground_threshold: int = Form(240),
    alpha_matting_background_threshold: int = Form(10),
    alpha_matting_erode_size: int = Form(10)
):
    """
    Remove background from uploaded image with enhanced options
    """
    try:
        # Validate model
        if model not in MODELS:
            raise HTTPException(status_code=400, detail=f"Invalid model. Available models: {list(MODELS.keys())}")
        
        # Read and validate image
        input_data = await file.read()
        is_valid, message = validate_image(input_data)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        logger.info(f"Processing image with model: {model}")
        
        # Optimize image for processing
        optimized_data = optimize_image(input_data)
        
        # Create session with specified model
        session = new_session(MODELS[model])
        
        # Process image with enhanced options
        output_data = remove(
            optimized_data,
            session=session,
            post_process_mask=post_process,
            alpha_matting=alpha_matting,
            alpha_matting_foreground_threshold=alpha_matting_foreground_threshold,
            alpha_matting_background_threshold=alpha_matting_background_threshold,
            alpha_matting_erode_size=alpha_matting_erode_size
        )
        
        logger.info("Background removal completed successfully")
        
        return StreamingResponse(
            io.BytesIO(output_data), 
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=background-removed.png"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Background removal error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process image. Please try again.")

@router.get('/models')
async def get_available_models():
    """Get list of available models"""
    return {
        "models": MODELS,
        "default": "u2net",
        "recommendations": {
            "general": "u2net",
            "portraits": "u2net_human_seg", 
            "clothing": "u2net_cloth_seg",
            "anime": "isnet-anime",
            "fast": "silueta"
        }
    }

@router.post('/remove-background-batch')
async def remove_bg_batch(files: list[UploadFile] = File(...)):
    """
    Remove background from multiple images (basic implementation)
    """
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 images allowed per batch")
    
    results = []
    for file in files:
        try:
            input_data = await file.read()
            is_valid, message = validate_image(input_data)
            if not is_valid:
                results.append({"filename": file.filename, "error": message})
                continue
            
            optimized_data = optimize_image(input_data)
            session = new_session("u2net")
            output_data = remove(optimized_data, session=session)
            
            results.append({
                "filename": file.filename,
                "success": True,
                "data": output_data
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return {"results": results} 