import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Authentication from './Authentication';
import { UsercontextProvider } from './context/UserContext';
import axios from 'axios';
import Chats from './chat/Chats';
function App() {

  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
  axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
    <UsercontextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/chat" element={<Chats />} />
      </Routes>
      </UsercontextProvider>
    </BrowserRouter>
  );
}

export default App;
