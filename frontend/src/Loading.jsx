import React from 'react'

function Loading() {
  return (
    <div className=' h-4 w-[55px] m-1 '>
      <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         enableBackground="new 0 0 0 0" xmlSpace="preserve">
        <circle fill="#fff" stroke="none" cx="6" cy="8" r="4">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.1" />
        </circle>
        <circle fill="#fff" stroke="none" cx="26" cy="8" r="4">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.2" />
        </circle>
        <circle fill="#fff" stroke="none" cx="46" cy="8" r="4">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.3" />
        </circle>
      </svg>

    </div>
  )
}

export default Loading
