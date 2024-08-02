import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import User from './User';
import PeopleList from './PeopleList';
import OtherPerson from './OtherPerson';
import Chat from './Chat';
import MessageBox from './MessageBox';
import backarrow from '../assets/backarrow.png';

function Chats() {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);
    const [currentView, setCurrentView] = useState('first');
    const [ws, setws] = useState(null);
    const { username, id, setid, setusername } = useContext(UserContext);
    const [selectedUser, setselectedUser] = useState(null);
    const [onlinePeople, setonlinePeople] = useState({});
    const [newMessage, setnewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [People, setPeople] = useState({});

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleViewChange = (view) => {
        if (!isLargeScreen) {
            setCurrentView(view);
        }
    };


    //making connection to websocket
    useEffect(() => {
        connectTOWs();
    }, [selectedUser]);

    function connectTOWs() {
        const serverUrl = import.meta.env.VITE_WS_SERVER_URL;
        const ws = new WebSocket(serverUrl);
        setws(ws);

/*         ws.addEventListener('message', handlemessage);
 */        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('trying to reconnect');
                connectTOWs();
            }, 1000);
        });
    }

    useEffect(() => {
        axios.get('/people').then(res => {
            const PeopleArr = res.data.filter(p => p._id !== id)
            const People = {};
            PeopleArr.forEach(p => {
                People[p._id] = p;
            });
            setPeople(People);
        });

    }, [selectedUser, id, onlinePeople, People, messages, newMessage]);

    //get people

    const [lastMessageTimes, setLastMessageTimes] = useState({});
    const getLastMessageTime = async (userId) => {
        try {
            const response = await axios.get(`/messages/${userId}`);
            const lastMessage = response.data.length > 0 ? response.data[response.data.length - 1] : null;

            if (lastMessage) {
                const { createdAt } = lastMessage;
                /*   const messageTime = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); */
                const messageTime = new Date(createdAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

                return messageTime;
            }
        } catch (error) {
            console.error('Error fetching last message time:', error.message);
        }

        return 'No messages';
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (selectedUser !== null) {
                    const response = await axios.get(`/messages/${selectedUser}`);
                    setMessages(response.data);
                }

            } catch (error) {
                console.error('Error fetching messages:', error.message);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {
        const fetchLastMessageTimes = async () => {
            const times = {};
            for (const userId of Object.keys(People)) {
                const time = await getLastMessageTime(userId);
                times[userId] = time;
            }
            setLastMessageTimes(times);
        };

        fetchLastMessageTimes();
    }, [People, messages, selectedUser]);
    const [selectedUserName, setselectedUserName] = useState(null);
    useEffect(() => {
        setselectedUserName(People[selectedUser]?.username)
    }, [selectedUser])

    return (
        <div className='flex items-center justify-center h-screen w-full'>
            {isLargeScreen || currentView === 'first' ? (
                <div onClick={() => handleViewChange('second')} className={`w-full md:w-1/3 h-full flex flex-col items-center justify-center`}>
                    <div className="h-[120px] w-full border-2 border-black" ><User username={username} /></div>
                    <div className="h-full w-full border-2 border-black"><PeopleList People={People} setselectedUser={setselectedUser} lastMessageTimes={lastMessageTimes} /></div>
                </div>
            ) : null}
            {isLargeScreen || currentView === 'second' ? (
                <div className={`w-full md:w-2/3 h-full flex flex-col`}>
                    <div className="h-[100px] border-2 w-full border-black flex items-center ">
                        <div className=" " onClick={() => handleViewChange('first')}>
                            <div className="bg-black p-1 cursor-pointer">
                                <img src={backarrow} alt="ba" className='h-12 w-12' />
                            </div>
                        </div>
                        <div className="flex items-center justify-center ml-[200px]">
                            <OtherPerson name={selectedUserName} />
                        </div>
                    </div>
                    <div className="h-full border-2 border-black"><Chat /></div>
                    <div className="h-[75px] border-2 border-black"><MessageBox /></div>
                </div>
            ) : null}
        </div>
    );
}

export default Chats;
