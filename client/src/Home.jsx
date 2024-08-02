import React from 'react';
import arrow from './assets/arrow.png';

const Home = () => {
    const textStyle = {
        fontFamily: "'Qwigley', cursive",
    };
    const textStyle2 = {
        fontFamily: "'Major Mono Display', monospace",
    };
    const startchat = {
        fontFamily: "'Amatic SC', sans-serif",
    }

    const mainstyle = {
        fontFamily: "'Major Mono Display', monospace",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textShadow: '3px 3px #05141b',
    }


    return (
        <>

            <div className="flex bg-[#111111]  overflow-hidden flex-col   h-screen w-full"
            >

                <div style={mainstyle} className=" flex mt-[250px] tracking-in-expand  text-[#db0847] text-[47px]   sm:text-6xl md:text-7xl lg:text-8xl"
                >KASHITOKARU</div>
                <div className="  text-[#eb819b] font-bold text-[33px]  sm:text-4xl md:text-4xl lg:text-5xl text-center p-0 mt-[50px] " style={textStyle}>
                    The Art of Conversation,<br /> Redefined...
                </div>

                <button className="p-2 rounded Capitalize bg-[#db0847] w-fit fixed bottom-[10px] right-[10px] text-xl" >
                    Sign Up
                </button>
            </div>
        </>


    );
};

export default Home;
