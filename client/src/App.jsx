import React from 'react';
import axios from 'axios';
import { UsercontextProvider } from './UserContext'; // Import the context provider
import Routes from './Routes';
import Home from './Home';

function App() {
    axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
  axios.defaults.withCredentials = true;

  return (
    <UsercontextProvider>
      <Routes />
    </UsercontextProvider>
  );
}

export default App;
