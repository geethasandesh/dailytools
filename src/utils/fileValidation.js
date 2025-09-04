// File validation utilities
export const FILE_LIMITS = {
  image: { maxSize: 10 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] },
  video: { maxSize: 100 * 1024 * 1024, types: ['video/mp4', 'video/webm', 'video/avi', 'video/mov'] },
  document: { maxSize: 50 * 1024 * 1024, types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
  code: { maxSize: 5 * 1024 * 1024, types: ['text/plain', 'application/json', 'text/javascript', 'text/html', 'text/css'] }
};

export const validateFile = (file, category = 'image') => {
  const limits = FILE_LIMITS[category];
  
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  if (file.size > limits.maxSize) {
    const maxMB = Math.round(limits.maxSize / (1024 * 1024));
    return { valid: false, error: `File too large. Maximum size: ${maxMB}MB` };
  }
  
  if (!limits.types.includes(file.type)) {
    return { valid: false, error: `Unsupported file type. Supported: ${limits.types.join(', ')}` };
  }
  
  return { valid: true };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};