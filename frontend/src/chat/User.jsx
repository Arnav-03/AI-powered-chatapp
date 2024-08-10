import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import * as themes from '../chat/Colors';
import account from '../assets/account.png';
import setting from '../assets/setting1.png';
import backarrow from '../assets/backarrow.png';
import Setting from './Setting';

function User({ username }) {
  const { setid, setusername } = useContext(UserContext);
  const [colortheme, setcolortheme] = useState("default_theme");
  const allThemes = themes;
  const lavenderTheme = allThemes[colortheme];
  const mainstyle = {
    fontFamily: "'Major Mono Display', monospace",
  };
  const usernameStyle = username?.length > 20 ? 'text-xl' : 'text-2xl';
  const [showsetting, setshowsetting] = useState(false)
  return (
    <div className="h-fit flex flex-col items-center justify-center w-full bg-[#292929] text-[#f0efec] relative">
      <div  className="text-2xl kktitle">KASHITOKARU</div>
      <div className='welcome text-xl w-full flex items-center justify-center'>
        <div className={`welcome ${usernameStyle} flex items-center px-10 border-[#afaeae]  w-full gap-4 justify-between p-2`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <img className='h-12 border-2 border-[#f0efec] rounded-full' src={account} alt="profile" />
            <div>{username?username:"no found"}</div>
          </div>
          <img onClick={()=>setshowsetting(!showsetting)} className='h-10 cursor-pointer rounded-full' src={!showsetting?setting:backarrow} alt="profile" />
        </div>
      </div>
       {showsetting && (
         <div className="fixed top-[100px] z-100 w-full md:w-1/3 h-full bg-[#292929] ">
         <Setting/>
         </div>
       )}
    </div>
  );
}

export default User;
