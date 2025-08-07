import onnxruntime as ort
import numpy as np

onnx_path = "models/modnet_photographic_portrait_matting.onnx"
session = ort.InferenceSession(onnx_path, providers=['CPUExecutionProvider'])

# Create a dummy input (1,3,512,512)
dummy = np.random.rand(1, 3, 512, 512).astype(np.float32)
ort_inputs = {session.get_inputs()[0].name: dummy}
ort_outs = session.run(None, ort_inputs)
print("ONNX output shape:", ort_outs[0].shape)