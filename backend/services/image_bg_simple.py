from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import StreamingResponse
from PIL import Image
import io
import logging

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

@router.post('/remove-background')
async def remove_bg(file: UploadFile = File(...)):
    """
    Simple background removal endpoint (placeholder)
    """
    try:
        # Read and validate image
        input_data = await file.read()
        is_valid, message = validate_image(input_data)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        logger.info("Image validation passed")
        
        # For now, just return the original image with a message
        # This will be replaced with actual rembg processing once dependencies are installed
        return StreamingResponse(
            io.BytesIO(input_data), 
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=background-removed.png"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process image. Please try again.")

@router.get('/models')
async def get_available_models():
    """Get list of available models"""
    return {
        "models": {
            "u2net": "General Purpose",
            "u2net_human_seg": "Human Portraits", 
            "u2net_cloth_seg": "Clothing Items",
            "silueta": "Fast Processing",
            "isnet-general-use": "General Use",
            "isnet-anime": "Anime/Cartoon"
        },
        "default": "u2net",
        "status": "dependencies_installing"
    }

@router.get('/status')
async def get_service_status():
    """Get service status"""
    try:
        import rembg
        return {"status": "ready", "message": "Background removal service is ready"}
    except ImportError:
        return {"status": "installing", "message": "Installing dependencies, please wait..."} 