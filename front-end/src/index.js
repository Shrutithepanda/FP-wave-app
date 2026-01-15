import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './hooks/AuthProvider';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { router } from './router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <></> {/* a header ? */}

    <AuthProvider>
      <RouterProvider router = {router} />
    </AuthProvider>
    
  </React.StrictMode>
  // <React.StrictMode>
  //   <BrowserRouter>
  //     <AuthProvider>
  //       <App />
  //     </AuthProvider>
  //   </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
