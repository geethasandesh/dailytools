# MODNet Integration Guide

This guide explains how to integrate the actual MODNet model into the Image Background Remover component.

## Current Implementation

The current implementation includes:
- ✅ Complete UI with transparent dropdowns
- ✅ File upload and validation
- ✅ Image processing pipeline
- ✅ Canvas-based image manipulation
- ✅ Download functionality
- ✅ Error handling and loading states
- ❌ Actual MODNet model integration (placeholder)

## Next Steps for Full MODNet Integration

### Option 1: Using TensorFlow.js with ONNX

1. **Install Dependencies**
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-backend-webgl onnxruntime-web
```

2. **Download MODNet Model**
- Download the MODNet ONNX model from the official repository
- Place it in `public/models/modnet.onnx`

3. **Update the Component**
Replace the `simulateMODNetProcessing` function with:

```javascript
import * as tf from '@tensorflow/tfjs';
import * as ort from 'onnxruntime-web';

const loadMODNetModel = async () => {
  try {
    // Load the ONNX model
    const session = await ort.InferenceSession.create('/models/modnet.onnx');
    return session;
  } catch (error) {
    console.error('Error loading MODNet model:', error);
    return null;
  }
};

const processImageWithMODNet = async (imageData, session) => {
  const { data, width, height } = imageData;
  
  // Preprocess image for MODNet
  const tensor = tf.tensor3d(data, [height, width, 4]);
  const resized = tf.image.resizeBilinear(tensor, [512, 512]);
  const normalized = resized.div(255.0);
  const batched = normalized.expandDims(0);
  
  // Run inference
  const feeds = { input: batched.arraySync() };
  const results = await session.run(feeds);
  const alpha = results.output[0];
  
  // Post-process alpha mask
  const alphaTensor = tf.tensor(alpha);
  const resizedAlpha = tf.image.resizeBilinear(alphaTensor, [height, width]);
  const alphaData = await resizedAlpha.array();
  
  // Apply alpha to original image
  const newData = new Uint8ClampedArray(data);
  for (let i = 0; i < data.length; i += 4) {
    const alphaValue = Math.round(alphaData[Math.floor(i / 4 / width)][(i / 4) % width] * 255);
    newData[i + 3] = alphaValue;
  }
  
  return new ImageData(newData, width, height);
};
```

### Option 2: Using Web Workers for Better Performance

1. **Create Web Worker**
Create `src/workers/modnetWorker.js`:

```javascript
import * as ort from 'onnxruntime-web';

let session = null;

self.onmessage = async function(e) {
  const { type, imageData } = e.data;
  
  if (type === 'init') {
    try {
      session = await ort.InferenceSession.create('/models/modnet.onnx');
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', error: error.message });
    }
  } else if (type === 'process') {
    try {
      const result = await processImage(imageData, session);
      self.postMessage({ type: 'result', result });
    } catch (error) {
      self.postMessage({ type: 'error', error: error.message });
    }
  }
};

async function processImage(imageData, session) {
  // MODNet processing logic here
  // Return processed ImageData
}
```

2. **Update Component to Use Worker**
```javascript
const [worker, setWorker] = useState(null);

useEffect(() => {
  const modnetWorker = new Worker('/src/workers/modnetWorker.js');
  modnetWorker.onmessage = (e) => {
    if (e.data.type === 'ready') {
      setWorker(modnetWorker);
    } else if (e.data.type === 'result') {
      setProcessedImage(e.data.result);
      setIsProcessing(false);
    }
  };
  
  modnetWorker.postMessage({ type: 'init' });
  
  return () => modnetWorker.terminate();
}, []);
```

### Option 3: Using a Backend API

1. **Create Backend Endpoint**
```python
# FastAPI backend
from fastapi import FastAPI, UploadFile, File
from rembg import remove
import io
from PIL import Image

app = FastAPI()

@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    input_image = Image.open(io.BytesIO(await file.read()))
    output_image = remove(input_image)
    
    output_buffer = io.BytesIO()
    output_image.save(output_buffer, format='PNG')
    output_buffer.seek(0)
    
    return StreamingResponse(output_buffer, media_type="image/png")
```

2. **Update Frontend**
```javascript
const processImage = async () => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  
  const response = await fetch('/api/remove-background', {
    method: 'POST',
    body: formData,
  });
  
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  setProcessedImage(url);
};
```

## Recommended Approach

For the best user experience, I recommend **Option 2 (Web Workers)** because:
- ✅ Runs in background thread (no UI blocking)
- ✅ Better performance for large images
- ✅ Progressive loading and processing
- ✅ Error handling and recovery

## Model Sources

- **Official MODNet**: https://github.com/ZHKKKe/MODNet
- **Pre-trained Models**: Available on Hugging Face and Model Zoo
- **ONNX Models**: Converted versions available in the community

## Performance Considerations

- **Model Size**: MODNet is ~25MB, consider lazy loading
- **Memory Usage**: Process images in chunks for large files
- **Caching**: Cache model after first load
- **Progressive Loading**: Show preview while processing

## Testing

Test with various image types:
- ✅ Portrait photos
- ✅ Product images
- ✅ Complex backgrounds
- ✅ Different lighting conditions
- ✅ Various image sizes

The current implementation provides a solid foundation - just replace the placeholder processing with actual MODNet inference! 