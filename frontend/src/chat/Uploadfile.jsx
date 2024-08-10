import React from 'react'
import send from "../assets/send.png"
import { useFileContext } from '../context/FileContext';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
  } from "firebase/storage";
  import { app } from "../FirebaseConfig";
  import { getFirestore } from "firebase/firestore";
  import { doc, setDoc } from "firebase/firestore";
  function Uploadfile({sendMessage}) {
    const {files,setFiles}=useFileContext();
    const storage = getStorage(app);
    const db = getFirestore(app);
    const sendfiles = () => {
        if (files.length === 0) {
          console.log("Choose files first");
          return;
        }
    
        if (files.length > 5) {
          console.log("Too many files");
          return;
        }
        
        files.forEach((item, index) => {
          const metadata = {
            contentType: item.file.type,
          };
          const storageRef = ref(
            storage,
            `Kashitokaru/` + item.file?.name
          );
          const uploadTask = uploadBytesResumable(storageRef, item.file, metadata);
  
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const fileProgress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              switch (error.code) {
                case "storage/unauthorized":
                  console.error(
                    "User doesn't have permission to access the object"
                  );
                  break;
                case "storage/canceled":
                  console.error("User canceled the upload");
                  break;
                case "storage/unknown":
                  console.error(
                    "Unknown error occurred, inspect error.serverResponse"
                  );
                  break;
              }
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("File link", downloadURL);
                sendMessage(null, {
                    name: item.file.name,
                    link: downloadURL,
                    type: item.file.type,
                });
              });  
            }
          );
        });
        setFiles([]);
        
      };
    return (
        <div className="border-[#ffffff] w-fit border-2 mr-4 text-white p-2 rounded-full  m-2">
            <img onClick={sendfiles} src={send} alt="send" className='h-6 min-h-6 w-6 min-w-6' />
        </div>
    )
}

export default Uploadfile
