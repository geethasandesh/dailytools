from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse
from rembg import remove
from io import BytesIO

router = APIRouter()

@router.post('/remove-background')
async def remove_bg(file: UploadFile = File(...)):
    input_data = await file.read()
    output_data = remove(input_data)
    return StreamingResponse(BytesIO(output_data), media_type="image/png") 