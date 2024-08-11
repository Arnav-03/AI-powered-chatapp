import React, { useState } from 'react'
import copy from "../assets/copy.png";

function Options({ message, id }) {
    const [Copy, setCopy] = useState(false);
    const copytext=()=>{
        setCopy(true);
        navigator.clipboard.writeText(message.text)

    }
    return (
        <div className='w-fit bg-[#ffffff] flex border-2 shadow-md rounded-xl p-4 m-1 mt-0.5'>
            <ul className='flex flex-col gap-1 nextf1'>
                <li onClick={copytext} className='flex cursor-pointer items-center justify-center gap-2'>
                    {!Copy?"Copy text":"Copied"} <img className='h-4' src={copy} alt="" />
                </li>
                <li className=' cursor-pointer'>Edit</li>
                {message.sender !== id && (
                    <li className=' cursor-pointer'>Reply with AI</li>
                )}
                                <li className=' cursor-pointer'>Delete</li>
            </ul>
        </div>
    )
}

export default Options
