import axios from 'axios';
import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext';
function Setting() {
  const { setid, setusername } = useContext(UserContext);
  const logout = async () => {
    await axios.post('/logout', {}, { withCredentials: true })
      .then(() => {
        setid(null);
        setusername(null);
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };
  return (
    <div className='flex flex-col border-t-2  items-center mt-[50px] h-full w-full'>
      <div className="text-3xl p-4 ">Settings</div>
      <div className="flex flex-col border-t-[1px] p-4 border-[#6e6b6b] w-full">
      <div onClick={logout} className="text-red-600 welcome text-2xl cursor-pointer">Logout</div>
      </div>
    </div>
  )
}

export default Setting
