import React, { createContext, useContext,useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);

  const addFile = (file) => {
    if(files.length>5){
        console.log("limit");
        return;
    }
    const fileWithId = { id: uuidv4(), file };
    setFiles((prevFiles) => [...prevFiles, fileWithId]);
  };

  const removeFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const uploadfiles = () => {
    if (files.length > 3) {
      console.log("nah");
      return;
    }
    console.log(files);
  };

  return (
    <FileContext.Provider value={{ files,setFiles, uploadfiles, addFile, removeFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};
