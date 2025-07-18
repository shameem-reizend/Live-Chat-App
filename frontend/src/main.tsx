// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {App} from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = "462342961885-5cm1khlh0u5tljttfn7t4jddoscol13l.apps.googleusercontent.com"

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
);
