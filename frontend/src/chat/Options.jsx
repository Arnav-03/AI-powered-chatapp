import React, { useContext, useState } from 'react'
import copy from "../assets/copy.png";
import { AIContext } from '../context/AIContext';

function Options({ setshowoptions, message, id }) {
    const [Copy, setCopy] = useState(false);
    const copytext = () => {
        setCopy(true);
        navigator.clipboard.writeText(message.text)

    }
    const { settexttochange, setshowAIoptions, setimagetochange, setfiletochange } = useContext(AIContext);
    return (
        <div className='w-fit bg-[#ffffff] flex border-2 shadow-md rounded-xl p-4 m-1 mt-0.5'>
            <ul className='flex flex-col gap-1 nextf1'>
                <li onClick={copytext} className='flex cursor-pointer items-center justify-center gap-2'>
                    {!Copy ? "Copy text" : "Copied"} <img className='h-4' src={copy} alt="" />
                </li>
                {message.sender !== id && (
                    <li onClick={() => {
                        setshowAIoptions(true);
                        setshowoptions(false);

                        if (message.file) {
                            // Extract the file extension from the message.text
                            const fileExtension = message.text.split('.').pop().toLowerCase();
                            console.log('File extension:', fileExtension);
                            let fileInfo = null;
                            // Parse JSON string if message.file is a string
                            if (typeof message.file === 'string') {
                                try {
                                    fileInfo = JSON.parse(message.file);
                                } catch (error) {
                                    console.error('Error parsing file JSON:', error);
                                }
                            } else {
                                fileInfo = message.file;
                            }
                            const link=fileInfo.link;
                            if (fileExtension === 'pdf' || fileExtension === "PDF") {
                                setfiletochange(link);
                                setimagetochange(null);
                            } else if (['png', 'PNG', 'jpeg', 'jpg'].includes(fileExtension)) {
                                setimagetochange(link);
                                setfiletochange(null);
                            }
                        }else{
                            setfiletochange(null);
                            setimagetochange(null);
                        }
                        settexttochange(message.text);
                    }} className='cursor-pointer'>Use AI</li>
                )}
                <li className=' cursor-pointer'>Edit</li>
                <li className=' cursor-pointer'>Delete</li>
            </ul>
        </div>
    )
}

export default Options



