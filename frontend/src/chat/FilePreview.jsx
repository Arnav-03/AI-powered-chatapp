import React, { useEffect, useState } from 'react'
import { useFileContext } from '../context/FileContext';
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

function FilePreview({name,sendMessage}) {
    const { files,removeFile } = useFileContext();
    const [showpreview, setShowpreview] = useState(false);
    function handleRemoveFile(id) {
        removeFile(id);
    }
    useEffect(() => {
        if (files.length > 0) {
            setShowpreview(true);
        } else {
            setShowpreview(false);
        }

        if(files.length===0){
            console.log("hahah")
        }
    }, [files])

    const getFileIcon = (filename) => {
        const extension = filename.split(".").pop()?.toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return photo;
            case "mp3":
            case "wav":
            case "m4a":
                return music;
            case "pdf":
                return pdf;
            case "mp4":
            case "mkv":
                return movie;
            case "apk":
                return apk;
            case "ppt":
            case "pptx":
                return ppt;
            case "txt":
                return txt;
            case "xlsx":
            case "xls":
                return xlsx;
            case "doc":
            case "docx":
                return doc;
            case "csv":
                return csv;
            default:
                return undefinedFIle;
        }
    };

    const sendfiles=()=>{
        console.log(files);
    }

    return (
        showpreview && (
            <div className=' bg-[#222222] border-[#292929] border-b-0 border-t-[1px]  h-fit border-2 slideUp w-full top-[100px] z-1000 '>
                <div className="">
                    <div className="nextf1 text-xl ml-3 text-[#ecebeb]">To: {name}</div>
                    {files.length > 0 && (
                        <ul className="w-full overflow-scroll  overflow-x-hidden">
                            {files.map(({ id, file }) => {
                                const trimmedName =
                                    file.name.length > 26
                                        ? `${file.name.slice(0, 26)}...`
                                        : file.name;
                                return (
                                    <li
                                        key={id}
                                        className="flex w-full items-center justify-between   text-lg mt-2 py-1"
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                className="ml-2 h-8"
                                                src={getFileIcon(file.name)}
                                                alt="icon"
                                            />
                                            <div className="text-[14px] text-[#c0bebe] nextf"> {trimmedName}</div>
                                        </div>

                                        <div
                                            onClick={() => handleRemoveFile(id)}
                                            className=" cursor-pointer"
                                        >
                                            <img className="h-5" src={deletefile} alt="delete" />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                <div className="  flex items-center justify-end  text-center w-full  nextf cursor-pointer">
                   <Uploadfile sendMessage={sendMessage}/>
                </div>
            </div>
        )
    );
}

export default FilePreview
