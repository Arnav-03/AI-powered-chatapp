import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { useGoogleLogin } from '@react-oauth/google';

function GoogleSignIN() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const responseMessage = (response) => {
        const userObject = jwtDecode(response.credential);
        setUser(userObject);
        localStorage.setItem('user', JSON.stringify(userObject));
    };

    const errorMessage = (error) => {
        console.log(error);
    };

    const logOut = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <div>
            <button onClick={logOut}>Log out</button>

            {user && (
                <div>
                    <h3>User Details</h3>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.picture} alt="User Profile" />
                </div>
            )}
            <br />
            <br />
            <GoogleLogin
                onSuccess={responseMessage}
                onError={errorMessage}
            />
        </div>
    );
}

export default GoogleSignIN;

