import React from "react";

function PeopleList({ selectedUser, People, lastMessageTimes, setselectedUser, handleViewChange }) {
  return (
    <div className="w-full h-full bg-[#f0efec] overflow-scroll overflow-x-hidden">
      {Object.values(People).length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-[#707070] welcome text-center"> Search for people in the search bar to initiate a conversation.</p>
        </div>
      ) : (
        Object.values(People).map((user) => (
          <div
            onClick={() => {
              setselectedUser(user._id);
              handleViewChange('second');
            }}
            className={`flex items-center cursor-pointer p-1 w-full px-4 m-2 rounded ${user._id === selectedUser ? "bg-[#1f1f1f] text-[#f0efec]" : "hover:bg-[#cfcfcf]"}`}
            key={user._id}
          >
            <div className="flex items-center gap-4 w-full">
              <div className={`uppercase border-2 rounded-full w-12 h-12 text-center flex items-center justify-center text-2xl ${user._id === selectedUser ? "border-[#f0efec]" : "border-[#1f1f1f]"}`}>
                {user.username[0]}
              </div>
              <div className="text-xl">{user.username}</div>
            </div>
            <div className="text-sm text-[#707070]">{lastMessageTimes[user._id]}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default PeopleList;
