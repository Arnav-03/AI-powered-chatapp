import React, { useContext, useState } from 'react';
import account from './assets/account.png'
import setting from './assets/setting1.png'

function Try() {

    const mainstyle = {
        fontFamily: "'Major Mono Display', monospace",
    };

    return (
        <div className="h-full flex flex-col items-center justify-center w-full bg-[#292929] text-[#f0efec]">
            <div style={mainstyle} className=" text-2xl">KASHITOKARU</div>
            <div className='welcome text-2xl flex items-center px-10 border-[#afaeae] border-t-2 w-full gap-4 justify-between p-2'>
                <div className="flex items-center gap-2">
                    <img className='h-12 border-2 border-[#f0efec] rounded-full' src={account} alt="profile" />
                    <div className="">Arnav Arora</div>
                </div>
                <img className='h-10 cursor-pointer rounded-full' src={setting} alt="profile" />
            </div>

        </div>
    );
}

export default Try;
