import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import dotenv from 'dotenv';
import { GoogleOAuthProvider } from "@react-oauth/google"

const clientId = import.meta.env.VITE_GOOGLE_CLIENT;
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId} >
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </GoogleOAuthProvider>

)
