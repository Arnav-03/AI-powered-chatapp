import axios from 'axios';
import React, { useContext, useState } from 'react'
import { UserContext } from './context/UserContext';
import Loading from './Loading';
const Register = () => {
    const { setusername: setLoggedInUsername, setid } = useContext(UserContext);

    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [IsloginOrRegister, setIsloginOrRegister] = useState("login")
    const [loginStatus, setLoginStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loginloading, setLoginloading] = useState(false);
    async function handlesubmit(e) {
        setLoginloading(true);
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
            setLoginloading(false);
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
        <div className="bg-[#f0efec] h-screen flex  items-center justify-center ">
            <div className="w-1/2 hidden lg:flex items-center justify-center  h-full border-r-2 bg-[#1d1d1d] border-[#292929]">
                <div style={mainstyle} className=" flex   text-[#f0efec]      lg:text-6xl"
                >KASHITOKARU</div>
            </div>
            <div className="w-1/2  flex flex-col items-center justify-center ">
                <div className='flex flex-col items-center justify-center w-full  '>
                    <div style={mainstyle} className="text-3xl text-[#292929]"
                    >KASHITOKARU</div>
                    <div className="border-2 mt-[50px] border-[#323232] p-2 text-center rounded-3xl px-4 w-[250px] flex items-center justify-center cursor-pointer"> 
                        <div className="mr-5 ml-[-5px] font-semibold  text-xl">G</div>
                        <div className=""> Continue with Google
                        </div>
                    </div>
                    <div className="flex flex-row items-center mt-[25px] w-[250px]    ">
                        <div className="h-[1px]  bg-black w-full "></div>
                        <div className="m-[2px] nextf2 text-lg">or</div>
                        <div className="h-[1px]  bg-black  w-full"></div>
                    </div>
                    <form
                        className=' backg mx-auto mt-[-50px] p-2' onSubmit={handlesubmit}>
                        <input type='text' onChange={(e) => setusername(e.target.value)} placeholder='username' value={username}
                            className='block border-2 border-[#292929] w-full p-2 mb-5' />
                        <input type='password' onChange={(e) => setpassword(e.target.value)} placeholder='password' value={password}
                            className='block w-full p-2 mb-5' />
                        <button className={`${!loginloading?"":"hidden"} bg-[#292929]  text-white  w-full rounded p-2 mb-5`}>
                            {(IsloginOrRegister == "register" ? "Register" : "Login")}
                        </button>
                        <div className={`${loginloading?"":"hidden"} bg-[#292929]  text-white  w-full rounded p-2 mb-5 flex items-center justify-center`}>
                        <Loading/></div>
                        <div className="flex items-center justify-center">

                            {IsloginOrRegister === "register" && (
                                <div className='text-[#323232]'> Already a member?
                                    <button className=' underline font-bold ml-2' onClick={() => setIsloginOrRegister('login')}>
                                        Login here
                                    </button>
                                </div>
                            )}
                            {IsloginOrRegister === "login" && (
                                <div className='text-[#323232]'> Not a member?
                                    <button className=' underline font-bold outline-none ml-2' onClick={() => setIsloginOrRegister('register')}>
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>


                    </form>

    
                    <div className="flex nextf  text-center  justify-center ">
                        {errorMessage && <div className="text-red-700 px-2 font-bold text-md  mt-[-40px]" style={{ whiteSpace: 'pre-line', width: '200px' }}>{errorMessage}</div>}
                    </div>



                </div>
            </div>


        </div>)
}
export default Register


