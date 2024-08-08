import React from "react";

function PeopleList({ People, lastMessageTimes, setselectedUser, handleViewChange }) {
  return (
    <div className="w-full h-full bg-[#292929] border-t-2 border-[#b3b2b2] overflow-scroll overflow-x-hidden">
      {Object.values(People).map((user) => (
        <div
          onClick={() => {
            setselectedUser(user._id);
            handleViewChange('second');
          }}
          className="flex items-center hover:bg-[#323232] cursor-pointer p-1  w-full px-4 m-2"
          key={user._id}
        >
          <div className="flex items-center gap-4 w-full ">
            <div className="uppercase border-2 rounded-full w-12 h-12 text-center flex items-center justify-center text-white text-2xl">{user.username[0]}</div>
            <div className="nextf1  text-xl text-[#d1d1d1]">{user.username}</div>
          </div>
          <div className="text-lg text-[#979797]">{lastMessageTimes[user._id]}</div>
        </div>
      ))}
    </div>
  );
}

export default PeopleList;
