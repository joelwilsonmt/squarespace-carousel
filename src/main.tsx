import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('endorser-carousel');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Target container #endorser-carousel not found');
}
