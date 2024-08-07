import React from 'react'
import sendbtn from '../assets/send.png';
import attach from '../assets/attach.png';

function MessageBox({sendMessage,newMessage,setnewMessage}) {
  
  return (
    <div>
      <form onSubmit={sendMessage}  className="flex gap-2 mx-2">
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
          <input type='file' className='hidden outline-none bg-transparent placeholder-slate-800'  />
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
