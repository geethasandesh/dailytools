import React from 'react';

const LoadingSpinner = ({ message = 'Processing...', progress = null }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
      <p className="text-white text-sm font-medium mb-2">{message}</p>
      {progress !== null && (
        <div className="w-full max-w-xs bg-white/10 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;