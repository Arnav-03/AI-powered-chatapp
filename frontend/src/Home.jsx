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
        <div className='h-screen bg-[#111111] flex items-center justify-center flex-col'>
            <div style={mainstyle} className=" flex  tracking-in-expand  text-[#db0847] text-[47px]   sm:text-6xl md:text-7xl lg:text-8xl"
            >KASHITOKARU</div>
            <div className="  text-[#9c9899] font-bold text-[33px]  sm:text-4xl md:text-4xl lg:text-5xl text-center p-0 mt-[50px] " style={textStyle}>
                The Art of Conversation,<br /> Redefined...
            </div>

            <button onClick={() => navigate("/auth")} className="p-4 rounded Capitalize bg-[#db0847] w-fit fixed bottom-[50px] right-[25px] text-xl" >
                Sign Up
            </button>
        </div>
    )
}

export default Home
