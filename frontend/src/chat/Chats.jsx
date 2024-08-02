import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import axios from 'axios';

function Chats() {
    const { setid ,username,setusername} = useContext(UserContext);
    const logout = () => {
        axios.post('/logout').then(() => {
            setid(null);
            setusername(null);
        })    }
    return (
        <div>
            chats
            <div className="">
                username: {username} <br />
            </div>
            <div onClick={logout} className="">
                logout
            </div>
        </div>
    )
}

export default Chats
