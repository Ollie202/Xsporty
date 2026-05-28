import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './stores/uiStore';
import './app.css';

const appRoot = document.getElementById('app-root');

if (appRoot) {
  createRoot(appRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
