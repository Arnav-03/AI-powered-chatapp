import React from 'react';
import { useNavigate } from "react-router-dom";

const mainstyle = {
    fontFamily: "'Major Mono Display', monospace",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}
const textStyle = {
    fontFamily: "'Qwigley', cursive",
};

function Home() {
    const navigate = useNavigate();

    return (
        <div className='h-screen bg-[#f0efec] flex items-center justify-center flex-col'>
            <div className="welcome nextf text-2xl md:text-3xl lg:text-4xl text-[#363636] ">Welcome to</div>
            <div style={mainstyle} className=" flex  tracking-in-expand  text-[#292929] text-[47px]   sm:text-6xl md:text-7xl lg:text-8xl"
            >KASHITOKARU</div>
            <div className="  text-[#323232] font-bold text-[33px]  sm:text-4xl md:text-4xl lg:text-5xl text-center p-0 mt-[50px] " style={textStyle}>
                The Art of Conversation,<br /> Redefined...
            </div>
            <button onClick={() => navigate("/auth")} className="m-0 nextf   Capitalize bg-[#1d1d1d] w-2/5 p-1 h-10 md:w-1/6  rounded-3xl fixed  bottom-10 text-[#f0efec]  text-xl" >
                Next
            </button>
        </div>
    )
}
export default Home
