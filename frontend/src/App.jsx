import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Authentication from './Authentication';
import { UsercontextProvider } from './context/UserContext';
import axios from 'axios';
import Chatpage from './chat/Chatpage';
import { FileProvider } from './context/FileContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
  axios.defaults.withCredentials = true;

  return (
    <div className="h-screen">
    <BrowserRouter>
    <GoogleOAuthProvider clientId="67929959631-fmm7bc79t0d94osga1rvsdmrk88ugroj.apps.googleusercontent.com">
    <UsercontextProvider>
      <FileProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/chat" element={<Chatpage />} />
      </Routes>
      </FileProvider>
      </UsercontextProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
