import React, { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";

export const UserContext = createContext({});

export function UsercontextProvider({ children }) {
  const location = useLocation();
  const [username, setusername] = useState(null);
  const [id, setid] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('/profile').then(response => {
      setid(response.data.userId);
      setusername(response.data.username);
    }).catch(error => {
      console.error('Error fetching profile');
    });
  }, []);
  useEffect(() => {
    if (id) {
      navigate('/chat');
    } else {
      if (location.pathname !== "/") {
        navigate('/auth');
      } 
    }

  }, [id]);
  return (
    <UserContext.Provider value={{ username, setusername, id, setid }}>
      {children}
    </UserContext.Provider>
  );
}
