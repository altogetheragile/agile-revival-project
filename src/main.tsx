
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// Error handling for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
