import React, { Suspense } from 'react';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { router } from './router';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import AuthProvider from './hooks/AuthProvider';
import Loader from './customComponents/Loader';
import EmotionProvider from './hooks/EmotionProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    {/* Emotion wrapper */}
    <EmotionProvider>
      {/* Authentication wrapper */}
      <AuthProvider>

        {/* Fallback to a loading screen */}
        <Suspense fallback = { <Loader/> } >
          {/* Provide routes */}
          <RouterProvider router = { router } />
        </Suspense>

      </AuthProvider>
    </EmotionProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
