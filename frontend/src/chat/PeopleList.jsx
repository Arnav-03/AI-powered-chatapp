import React from "react";

function PeopleList({ People, lastMessageTimes, setselectedUser, handleViewChange }) {
  return (
    <div className="w-full h-full">
      {Object.values(People).map((user) => (
        <div
          onClick={() => {
            setselectedUser(user._id); 
            handleViewChange('second'); 
          }}
          className="flex items-center justify-between w-full border-2"
          key={user._id}
        >
          <div>{user.username[0]}</div>
          <div className="">{user.username}</div>
          <div className="text-xl text-[#000000]">{lastMessageTimes[user._id]}</div>
        </div>
      ))}
    </div>
  );
}

export default PeopleList;
