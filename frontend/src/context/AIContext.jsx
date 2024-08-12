import React, { createContext, useState, useEffect } from "react";
import axios from 'axios'


export const AIContext = createContext({});

export function AIContextProvider({ children }) {
  const [texttochange, settexttochange] = useState(null);
  const [filetochange, setfiletochange] = useState(null);
  const [imagetochange, setimagetochange] = useState(null);

  const [resultofAI, setresultofAI] = useState("");
  const [showAIoptions, setshowAIoptions] = useState(false);

  const smartreply=()=>{
    console.log("smartreply")
  }
  const summarize=()=>{
    console.log("summarize")
  }
  const translate=()=>{
    console.log("translate")
  }
  const ImageCaptioning=()=>{
    console.log("ImageCaptioning");
  }
  const changeTheme=()=>{
    console.log("changeTheme")
  }


 
  return (
    <AIContext.Provider value={{ texttochange,settexttochange,resultofAI,setresultofAI, smartreply,summarize,translate,ImageCaptioning,changeTheme,showAIoptions,setshowAIoptions ,imagetochange,setimagetochange,filetochange,setfiletochange }}>
      {children}
    </AIContext.Provider>
  );
}
