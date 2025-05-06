
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// More comprehensive error handling for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Prevent the error from crashing the entire app if possible
  event.preventDefault();
});

// More robust error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Prevent the error from crashing the entire app if possible
  event.preventDefault();
});

// Add additional safety wrapper around the render
try {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <App />
        </React.Suspense>
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Fatal error rendering application:', error);
  
  // Render a simple error page instead of crashing completely
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Critical Error</h2>
        <p className="mb-4 text-gray-700">The application failed to initialize properly.</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try reloading
        </button>
      </div>
    </div>
  );
}
