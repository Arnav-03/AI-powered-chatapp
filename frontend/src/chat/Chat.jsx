import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';

function Chat({ messages, selectedUser }) {
  const endOfMessagesRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const checkIfUserAtBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      setIsUserAtBottom(scrollHeight - scrollTop <= clientHeight + 1);
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', checkIfUserAtBottom);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', checkIfUserAtBottom);
      }
    };
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (isUserAtBottom && chatContainer) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserAtBottom]);
  const messagesWithoutDupe = _.uniqBy(messages, '_id');
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''; // If the timestamp is missing or invalid, return an empty string

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return ''; // If the date is invalid, return an empty string
    }

    // Get date components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Get time components
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return ` ${hours}:${minutes}`;
  };
  function getCurrentTimestamp() {
    const date = new Date();
    const day = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return { day, time };
  }
  return (
    <div ref={chatContainerRef} className='flex-grow overflow-auto h-full'>

      {messagesWithoutDupe.map((message, index) => {
        if (message.sender === selectedUser || message.recipient === selectedUser) {

          return (
            <div
              key={message._id}
            >
              <div

                className={`p-2.5 m-0.5 max-w-[70%] rounded-[15px] inline-block font-medium `}
                key={index}
              >
                <div className="inline-block text-justify  font-sans sm:text-base md:text-lg break-words max-w-[100%]">
                  {message.text}
                  {!message.file && (
                    <div>
                      <div className="text-xs text-[#071b09] ">
                        {formatTimestamp(message.createdAt) ? '' : (message.time ? ` ${message.time}` : (message.time = getCurrentTimestamp().time))}
                      </div>

                      <div className="text-xs text-[#071b09] ">
                        {formatTimestamp(message.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
      <div ref={endOfMessagesRef} />
    </div>
  );
}

export default Chat;
