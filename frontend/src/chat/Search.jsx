import React, { useContext, useEffect, useState } from 'react';
import cross1 from '../../src/assets/cross.png';
import account from '../../src/assets/account.png';
import search from '../../src/assets/search1.png';


function Search({setSearchTerm, handleSearch, searchTerm, handleViewChange, setselectedUser, searchResults,setselectedUserName }) {
    const [cross, setCross] = useState(false);
    const handleclick = () => {
        setCross(!cross);

    }
    useEffect(() => {

        if (searchTerm.length == 0 && cross) {
            setCross(false);
        }
    }, [cross, searchTerm])

    return (
        <div className='relative  w-full h-fit '>
            <div className="flex  bg-[#292929] items-center justify-center  text-[#f0efec]">
                <img onClick={handleclick} className={`h-[30px] mt-[2px] z-10  rounded-[10px] cursor-pointer `} src={search}></img>
                <input
                    className={`ml-[-40px] bg-[#3f3f3f] w-3/4   rounded-3xl nextf1 h-9 outline-none  p-3 pl-12 pr-10 m-2  font-bold`}
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => { handleSearch(e); setCross(true) }}
                />
            </div>
            {searchTerm.length > 0 && cross && (
                <ul className={` fixed top-[150px]  z-10 bg-[#292929] text-[#f7f7f7] p-5  w-full md:w-1/3  overflow-scroll h-full flex   flex-col border-t-2 `}>
                    {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <li
                                className={`flex flex-row cursor-pointer overflow-hidden font-mono text-xl border-b-[1px] border-[#636262] p-1 m-2 font-bold items-center`}
                                key={user._id}
                                onClick={() => {
                                    setselectedUser(user._id);
                                    setselectedUserName(user.username);
                                    setSearchTerm('');
                                    handleViewChange('second');
                                }}
                            >
                                <img
                                    className='h-8 border-2  mt-[3px] rounded-full m-[3px] mr-4'
                                    src={account}
                                    alt='Account'
                                />
                                {user.username}
                            </li>
                        ))
                    ) : (
                        <div className="flex justify-center">
                            <li className={`border-b-2 font-mono font-bold`}>No User found !!!</li>
                        </div>
                    )}
                </ul>
            )}
        </div>
    )
}

export default Search
