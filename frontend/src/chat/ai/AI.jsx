import React, { useContext, useEffect, useState } from 'react';
import { AIContext } from '../../context/AIContext';
import cross from '../../assets/cross.png';
import copy from '../../assets/copy.png';
import Loading from '../../Loading';
import axios from 'axios';

function AI({ setnewMessage }) { // Add setnewMessage as a prop
  const {
    texttochange,
    settexttochange,
    resultofAI,
    setresultofAI,
    showAIoptions,
    setshowAIoptions,
    imagetochange,
    filetochange,
  } = useContext(AIContext);

  const [showresult, setshowresult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAItool, setselectedAItool] = useState("");
  const [userprompt, setprompt] = useState("");
  const [showfileicon, setshowfileicon] = useState(false);
  const [showimageicon, setshowimageicon] = useState(false);

  useEffect(() => {
    if (filetochange) setshowfileicon(true);
    if (imagetochange) setshowimageicon(true);
  }, [filetochange, imagetochange]);

  useEffect(() => {
    if (resultofAI && resultofAI.length > 0) {
      setshowresult(true);
      setLoading(false);
    }
  }, [resultofAI]);

  const handleReset = () => {
    setresultofAI("");
    setshowresult(false);
    setLoading(false);
  };

  const tools = showfileicon ? ["Reply Pdf", "Describe Pdf"]
    : showimageicon ? ["Reply Image", "Describe Image"]
      : ["Summarize", "Auto Reply"];

  const getresponsefromAI = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/getresponsefromAI`, {
        userprompt,
        selectedAItool,
        texttochange,
        filetochange,
        imagetochange,
      });
      setresultofAI(data.reply);
    } catch (error) {
      console.error('Error getting response from AI:', error);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultofAI);
    setnewMessage(resultofAI); // Set the result to the message input
    setshowAIoptions(false)
  };

  return (
    <div className='bg-[#292929] slideUp items-center p-2 flex flex-col text-[#faf9f9] w-full'>
      <div className="w-full justify-end flex">
        <div onClick={() => setshowAIoptions(false)} className="cursor-pointer border-2 rounded-full w-fit p-1">
          <img className='h-5' src={cross} alt="Close" />
        </div>
      </div>
      {!loading && !showresult && (
        <>

          <div className="w-3/5 overflow-hidden flex flex-wrap text-wrap max-h-[75px] bg-[#505050] text-sm text-center justify-center rounded-3xl p-2">
            {texttochange?.substring(0, 100) || ""}
          </div>
          <div className="flex flex-wrap w-full gap-2 justify-center mt-4 h-fit">
            {tools.map((tool) => (
              <div
                key={tool}
                onClick={() => setselectedAItool(tool)}
                className={`cursor-pointer nextf1 p-1.5 px-3 h-fit rounded-3xl`}
                style={{
                  backgroundColor: selectedAItool === tool ? "#000000" : "#b6b6b6",
                  color: selectedAItool === tool ? "#ffffff" : "#000000",
                }}
              >
                {tool}
              </div>
            ))}
          </div>
          <div className="m-3 w-full flex flex-col items-center">
            <input
              value={userprompt}
              onChange={(e) => setprompt(e.target.value)}
              placeholder='Prompt (optional)'
              className='bg-[#3f3f3f] w-4/5 p-1 pl-4 rounded-2xl outline-none'
              type="text"
              name="prompt"
            />
          </div>
        </>
      )}

      {!loading && showresult && (
        <div className="max-h-[210px] flex flex-col w-full text-justify text-black overflow-scroll bg-[#e9e9e9] nextf1 rounded-lg p-1 px-3 m-2">
          <div className="text-black justify-end nextf1 text-md gap-2 flex">
            Copy to text box
            <img className='h-6 cursor-pointer' src={copy} alt="Copy" onClick={handleCopy} />
          </div>
          {resultofAI}
        </div>
      )}

      {loading && (
        <div className="bg-[#21455e] p-0.5 min-w-[200px] max-w-[200px] rounded-md nextf flex-col overflow-hidden flex items-center justify-center">
          Fetching Results
          <Loading />
        </div>
      )}

      {!loading && !showresult && (
        <div onClick={getresponsefromAI} className="bg-[#21455e] cursor-pointer p-1 min-w-[110px] max-w-[110px] rounded-md nextf mt-4">
          Get Response
        </div>
      )}

      {showresult && (
        <div onClick={handleReset} className="bg-[#0a0a0a] p-1 min-w-[110px] max-w-[110px] rounded-md nextf mt-4 cursor-pointer text-center">
          Reset
        </div>
      )}
    </div>
  );
}

export default AI;
