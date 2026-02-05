import React, { Suspense } from 'react';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { router } from './router';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import App from './app/App';

import AuthProvider from './hooks/AuthProvider';
import Loader from './customComponents/Loader';
import EmotionProvider from './hooks/EmotionProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Mounts things two times - so could be temporarily disabled. Also to prevent calling emotion API too frequently.
  <React.StrictMode>

    <EmotionProvider>
      <AuthProvider>
        {/* Fallback to a screen showing loader */}
        <Suspense fallback = {<Loader/>} >
          {/* Provide routes */}
          <RouterProvider router = {router} />
        </Suspense>
      </AuthProvider>
    </EmotionProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
