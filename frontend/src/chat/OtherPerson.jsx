import React, { useEffect, useState } from 'react'
import backarrow from '../assets/back1.png'
import menu from '../assets/setting1.png'
import axios from 'axios'
function OtherPerson({ selectedUserName, handleViewChange, setselectedUser }) {
  const [usern, setusern] = useState(null)
  useEffect(() => {

    if (selectedUserName) {
      setusern(selectedUserName);
    }
  }, [selectedUserName])
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.post('/getuserimage', { username: usern });
        if (response.data.image) {
          setProfileImage(response.data.image);
        }
      } catch (error) {
      }
    };

    if (usern) {
      fetchProfileImage();
    }
  }, [usern]);

  return (
    <div className=' flex items-center md:border-l-2 border-[#f0efec] text-[#f0efec]  w-full h-[90px] bg-[#292929]'>
      <div onClick={() => {
        handleViewChange('first');
        setselectedUser(null);
      }} className="ml-4 w-fit cursor-pointer ">
        <img src={backarrow} alt="Back Arrow" className='h-12 w-12  min-w-12 md:hidden' />
      </div>
      <div className="flex w-full ml-10">
        {profileImage && (
          <div className="rounded-full flex items-center justify-center border-2 overflow-hidden h-14 w-14 min-w-14 max-w-14  min-h-14 max-h-14 ">
            <img className='h-14 w-14 min-w-14 max-w-14  min-h-14 max-h-14' src={profileImage} alt="" />
          </div>
        )}
        {!profileImage && (
          <div className={`uppercase border-2  rounded-full w-14 h-14  min-w-14  text-center flex items-center justify-center  text-2xl 
    border-[#f0efec]`}>{usern ? usern[0] : "fetching result"}</div>
        )}

        <div className="nextf2 text-[#f0efec] ml-4  w-full text-3xl ">{usern}</div>
      </div>

      <div className="">
        <img src={menu} alt="Back Arrow" className='h-9 w-9 cursor-pointer rotate-90 mr-4 ' />
      </div>

    </div>
  )
}

export default OtherPerson
