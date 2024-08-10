import React from 'react'
import backarrow from '../assets/back1.png'
import menu from '../assets/setting1.png'

function OtherPerson({ name, handleViewChange, setselectedUser }) {

  return (
    <div className=' flex items-center md:border-l-2 border-[#f0efec] text-[#f0efec]  w-full h-[90px] bg-[#292929]'>
      <div onClick={() => {
        handleViewChange('first');
        setselectedUser(null);
      }} className="ml-4 w-fit cursor-pointer ">
        <img src={backarrow} alt="Back Arrow" className='h-12 w-12  min-w-12 md:hidden' />
      </div>
      <div className="flex w-full ml-10">
        <div className={`uppercase border-2  rounded-full w-14 h-14  min-w-14  text-center flex items-center justify-center  text-2xl 
           border-[#f0efec]`}>{name ? name[0] : ""}</div>
        <div className="nextf2 text-[#f0efec] ml-4  w-full text-3xl ">{name}</div>
      </div>

      <div className="">
      <img src={menu} alt="Back Arrow" className='h-9 w-9 cursor-pointer rotate-90 mr-4 ' />
      </div>
 
    </div>
  )
}

export default OtherPerson
