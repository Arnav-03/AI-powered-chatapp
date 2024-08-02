import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import axios from 'axios';

function User({ username }) {
  const { setid, setusername } = useContext(UserContext);
  const logout = () => {
    axios.post('/logout').then(() => {
      setid(null);
      setusername(null);
    });
  };
  return (
    <div className="h-full flex items-center justify-center">
      <div className=' '>
        {username}
      </div>
      <div onClick={logout} className="">
      logout
      </div>
    </div>

  )
}

export default User
