import axios from 'axios';
import React, { useContext, useState } from 'react'
import { UserContext } from './context/UserContext';
const Register = () => {
    const { setusername: setLoggedInUsername, setid } = useContext(UserContext);

    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [IsloginOrRegister, setIsloginOrRegister] = useState("login")
    const [loginStatus, setLoginStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handlesubmit(e) {
        e.preventDefault();
        const url = IsloginOrRegister === "register" ? 'register' : 'login';
        if (IsloginOrRegister === "register") {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;
            if (!passwordRegex.test(password)) {
                setErrorMessage("Password must be at least 8 characters long, include at least one uppercase letter, and one special character.");
                return;
            }
        }
        let loginSuccess = false;

        try {
            const { data } = await axios.post(`/${url}`, { username, password });
            setLoggedInUsername(username);
            setid(data.id);
            loginSuccess = true;
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data?.error || "An error occurred");
        }

        if (loginSuccess) {
            setLoginStatus(true);
            setErrorMessage("");
        }
    }
    const mainstyle = {
        fontFamily: "'Major Mono Display', monospace",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
    return (
        <div className="bg-[#0e0c0c] h-screen flex p-4 items-center justify-center ">
            <div className="w-1/2 hidden lg:flex items-center justify-center  h-full border-r-2 border-[#db0847]">
                <div style={mainstyle} className=" flex   text-[#db0847]     lg:text-6xl"
                >KASHITOKARU</div>
            </div>
            <div className="w-1/2">
                <div className='flex flex-col items-center justify-center  '>

                    <form
                        className=' backg mx-auto p-2' onSubmit={handlesubmit}>
                        <input type='text' onChange={(e) => setusername(e.target.value)} placeholder='username' value={username}
                            className='block border-2 border-[#db0847] w-full p-2 mb-5' />
                        <input type='password' onChange={(e) => setpassword(e.target.value)} placeholder='password' value={password}
                            className='block w-full p-2 mb-5' />
                        <button className='bg-[#db0847] text-white block w-full rounded p-2 mb-5'>
                            {(IsloginOrRegister == "register" ? "Register" : "Login")}
                        </button>
                        <div className="flex items-center justify-center">
                            {IsloginOrRegister === "register" && (
                                <div className='text-white'> Already a member?
                                    <button className='text-fuchsia-800 underline font-bold ml-2' onClick={() => setIsloginOrRegister('login')}>
                                        Login here
                                    </button>
                                </div>
                            )}
                            {IsloginOrRegister === "login" && (
                                <div className='text-white'> Not a member?
                                    <button className='text-fuchsia-800 underline font-bold outline-none ml-2' onClick={() => setIsloginOrRegister('register')}>
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>


                    </form>

                    <div className="flex justify-center ">
                        {loginStatus && <div className="text-green-600">Logging in...</div>}
                    </div>
                    <div className="flex   justify-center ">
                        {errorMessage && <div className="text-red-600 px-2 font-bold text-[14px]  mt-[-40px]" style={{ whiteSpace: 'pre-line', width: '200px' }}>{errorMessage}</div>}
                    </div>

                </div>
            </div>


        </div>)
}
export default Register


