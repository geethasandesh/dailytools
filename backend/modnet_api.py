from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import onnxruntime as ort
import cv2
from PIL import Image
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to your downloaded MODNet ONNX model
onnx_path = os.path.join(os.path.dirname(__file__), "models", "modnet_photographic_portrait_matting.onnx")
session = ort.InferenceSession(onnx_path, providers=['CPUExecutionProvider'])

def preprocess(img: np.ndarray) -> np.ndarray:
    # Resize to 512x512, normalize to [0,1], and transpose to (1,3,512,512)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (512, 512))
    img = img.astype(np.float32) / 255.0
    img = np.transpose(img, (2, 0, 1))
    img = np.expand_dims(img, 0)
    return img

def postprocess(alpha: np.ndarray, orig_shape) -> np.ndarray:
    # alpha: (1,1,512,512) -> (H,W)
    alpha = alpha.squeeze()
    alpha = cv2.resize(alpha, (orig_shape[1], orig_shape[0]))
    alpha = (alpha * 255).astype(np.uint8)
    return alpha

@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = np.array(Image.open(io.BytesIO(contents)).convert("RGB"))
        orig_shape = img.shape[:2]

        # Preprocess
        input_tensor = preprocess(img)
        ort_inputs = {session.get_inputs()[0].name: input_tensor}
        ort_outs = session.run(None, ort_inputs)
        alpha = ort_outs[0]  # (1,1,512,512)

        # Postprocess
        matte = postprocess(alpha, orig_shape)

        # Composite foreground with transparent background
        rgba = np.dstack([img, matte])
        out_img = Image.fromarray(rgba, mode="RGBA")

        buf = io.BytesIO()
        out_img.save(buf, format="PNG")
        buf.seek(0)
        return StreamingResponse(buf, media_type="image/png")
    except Exception as e:
        print("Error in /remove-background:", e)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))