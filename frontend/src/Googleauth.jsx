import React, { useContext, useEffect, useState } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { UserContext } from './context/UserContext';

function Googleauth() {

    const [user, setUser] = useState(null);
    const { username, id, setid, setusername } = useContext(UserContext);
    const send = async () => {
        const username = user.name;
        const email = user.email;
        const imageurl = user.picture;
        const { data } = await axios.post(`/googleauth`, { username, email, imageurl });
        if (data) {
            setusername(data.username);
            setid(data.id);
        }
    }
    useEffect(() => {
        if (user) {
            send(user);
        }
    }, [user])


    const handleSuccess = (credentialResponse) => {
        const { credential } = credentialResponse;
        const decodedUser = jwtDecode(credential);
        setUser(decodedUser);
    };

    return (
        <div className='mt-[20px]'>
            <GoogleLogin
                width={250}
                theme="filled_black"
                text='continue_with'
                onSuccess={handleSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    );
}

export default Googleauth;
