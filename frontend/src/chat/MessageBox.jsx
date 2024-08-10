import React, { useContext, useState } from 'react'
import sendbtn from '../assets/send.png';
import attach from '../assets/attach.png';
import { useFileContext } from '../context/FileContext';
import FilePreview from './FilePreview';

function MessageBox({ sendMessage, newMessage, setnewMessage,setshowfiless }) {

  const { addFile } = useFileContext();
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB in bytes
    const maxFiles = 5; // Maximum number of files allowed

    let errorMessage = "";

    if (files.length > maxFiles) {
      errorMessage = `You can only upload a maximum of ${maxFiles} files at once.`;
      console.log("error-> ", errorMessage);
      return;
    }

    files.forEach((file) => {
      if (file.size > maxSizeInBytes) {
        errorMessage = "File size exceeds 5 MB";
        console.log("error-> ", errorMessage);
      } else {
        addFile(file);
      }
    });
    setshowfiless(true);
  };
  return (
    <div>
      <form onSubmit={sendMessage} className="flex gap-2 mx-2">
        <input
          value={newMessage}
          onChange={(e) => setnewMessage(e.target.value)}
          type="text"
          placeholder="Type your message here..."
          name=""
          id=""
          className={`p-2   placeholder-black border-2 border-black m-3 flex-grow rounded-lg outline-none `}
        />
        <label className={` cursor-pointer p-2 px-0.5 my-3 text-white bg-black rounded-lg`}>
          <input onChange={handleFileChange} multiple
            type='file' className='hidden outline-none bg-transparent placeholder-slate-800' />
          <img className="h-7" src={attach} alt="Send" />
        </label>
        <button type='submit' className={` p-2 px-1.5 m-3 mx-0 text-white bg-black rounded-lg`}>
          <img className="h-7" src={sendbtn} alt="Sen" />
        </button>
      </form>
    </div>
  )
}

export default MessageBox
