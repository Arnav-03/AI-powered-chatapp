import React, { useContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import photo from '../assets/photo.png'
import doc from "../assets/doc.png";
import music from "../assets/music.png";
import pdf from "../assets/pdf.png";
import movie from "../assets/movie.png";
import apk from "../assets/apk.png";
import ppt from "../assets/ppt.png";
import txt from "../assets/txt.png";
import undefinedFIle from "../assets/undefinedFIle.png";
import xlsx from "../assets/xlsx.png";
import csv from "../assets/csv.png";
import deletefile from "../assets/remove1.png"
import Uploadfile from './Uploadfile';

function Chat({ id, messages, selectedUser }) {
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
      endOfMessagesRef.current?.scrollIntoView({ /* behavior: 'smooth' */ });
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
  function getImageForFileType(file,link) {
    // Check if file is a string
    if (typeof file !== 'string') {
      return undefinedFIle; // Return a default image or placeholder if file is not a string
    }

    // Convert file extension to lowercase
    const fileExtension = file.toLowerCase();

    if (fileExtension.endsWith('.pdf')) {
      return pdf;
    } else if (fileExtension.endsWith('.doc') || fileExtension.endsWith('.docx')) {
      return doc;
    } else if (fileExtension.endsWith('.txt')) {
      return txt;
    } else if (fileExtension.endsWith('.xls') || fileExtension.endsWith('.xlsx') || fileExtension.endsWith('.csv')) {
      return xlsx;
    } else if (fileExtension.endsWith('.jpg') || fileExtension.endsWith('.jpeg') || fileExtension.endsWith('.png')) {
      return link;
    } else if (fileExtension.endsWith('.ppt') || fileExtension.endsWith('.pptx')) {
      return ppt;
    } else {
      return undefinedFIle; // Return a default image or placeholder if file type is unknown
    }
  }

  return (
    <div ref={chatContainerRef} className='flex-grow overflow-auto h-full border-t-2 p-1'>
      {messagesWithoutDupe.map((message, index) => {
        if (message.sender === selectedUser || message.recipient === selectedUser) {
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

          return (
            <div className={message.sender === id ? 'text-right' : 'text-left'} key={message._id}>
                {fileInfo && (
                  <div>
                    <div className={`underline flex ${message.sender===id?"justify-end":"justify-start"} text-center italic cursor-pointer`}>
                      <a target='_blank' href={fileInfo.link} rel="noopener noreferrer">
                        <img
                          className='h-[100px] w-[100px] m-0 p-0 rounded-xl'
                          src={getImageForFileType(fileInfo.name,fileInfo.link)}
                          alt='File preview'
                        />
                      </a>
                    </div>
                  </div>
                )}
              <div
                className={`py-1 px-6 m-[1px] max-w-[70%] rounded-3xl inline-block font-medium ${message.sender === id ? "bg-[#b8b7b7] text-[#000000]" : "bg-[#292929] text-[#fffcfc]"}`}
                key={index}
              >
              
                <div className="inline-block text-justify font-sans sm:text-base md:text-md break-words max-w-[100%]">
                  {message.text}
                  {/* {!message.file && (
                  <div>
                    <div className="text-[10px] text-[#071b09] ">
                      {formatTimestamp(message.createdAt) ? '' : (message.time ? ` ${message.time}` : (message.time = getCurrentTimestamp().time))}
                    </div>
                    <div className="text-[10px] border-2 m-0 p-0 text-[#071b09] ">
                      {formatTimestamp(message.createdAt)}
                    </div>
                  </div>
                )} */}
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