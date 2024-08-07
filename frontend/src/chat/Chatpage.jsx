import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import User from './User';
import PeopleList from './PeopleList';
import OtherPerson from './OtherPerson';
import Chat from './Chat';
import MessageBox from './MessageBox';
import backarrow from '../assets/backarrow.png';
import NoChat from './NoChat';
import cross from '../../src/assets/cross.png';
import account from '../../src/assets/account.png';

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

        ws.addEventListener('message', handlemessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('trying to reconnect');
                connectTOWs();
            }, 1000);
        });
    }
    const showPeople = (onlineData) => {

    };
    function handlemessage(e) {
        const messageData = JSON.parse(e.data);
        if (typeof messageData === 'object' && 'online' in messageData) {
            showPeople(messageData.online);
        } else if ('text' in messageData) {
            const isMessageForSelectedUser = messageData.sender === selectedUser || messageData.recipient === selectedUser;
            if (isMessageForSelectedUser) {
                setMessages(prevMessages => [...prevMessages, { ...messageData, isOur: false }]);
            }
        }
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

    //get peopleselectedUser, id, onlinePeople, People, messages, newMessage
    const [lastMessageTimes, setLastMessageTimes] = useState({});
    const getLastMessageTime = async (userId) => {
        try {
            const response = await axios.get(`/messages/${userId}`);
            const lastMessage = response.data.length > 0 ? response.data[response.data.length - 1] : null;

            if (lastMessage) {
                const { createdAt } = lastMessage;
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
    }, [selectedUser, People]);

    function sendMessage(e) {
        if (e) e.preventDefault();

        const createdAt = new Date();
        const day = createdAt.toLocaleDateString('en-US');
        const time = createdAt.toLocaleTimeString('en-US');

        if (!newMessage.trim()) {
            return;
        }

        ws.send(JSON.stringify({
            day,
            time,
            recipient: selectedUser,
            text: newMessage,
            isRead: false,
            createdAt,
        }));

        setnewMessage('');
        const newMessageData = {
            day,
            time,
            text: newMessage,
            sender: id,
            isRead: false,
            recipient: selectedUser,
            _id: Date.now(),
            isOur: true,
            createdAt,
        };

        setMessages(prev => ([...prev, newMessageData]));
    }


    const [showsearch, setshowsearch] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        try {
            const response = await axios.get(`/allpeople?searchTerm=${term}`);

            const { exists, users } = response.data;

            if (exists) {
                const searcherUsername = username;
                const filteredUsers = users.filter(user => user.username !== searcherUsername);

                setSearchResults(filteredUsers);
                console.log(filteredUsers);
            } else {
                console.log("no user found");
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen w-full'>
            {isLargeScreen || currentView === 'first' ? (
                <div className="w-full md:w-1/3 h-full flex flex-col items-center justify-center">
                    <div className="h-[120px] w-full border-2 border-black">
                        <User username={username} />
                    </div>
                    {showsearch && (
                        <div>
                            <div className="flex flex-row">
                                <input
                                    className={` bg-transparent  border-[1px] rounded-[10px] font-mono h-9 outline-none  w-full  p-3 pl-10 pr-10 m-2 ml-0 mb-1 font-bold`}
                                    type="text"
                                    placeholder="Search by username..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e)}
                                />
                                <img onClick={() => { setshowsearch(false) }} className={`h-[30px] mt-[10px] rounded-[10px] ml-[-43px]`} src={cross}></img>
                            </div>

                            {searchTerm.length > 0 && (
                                <ul className={`
                                    bg-transparent rounded-[10px] p-3 mb-4 w-full border-[1px]  overflow-scroll max-h-[200px]`}>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((user) => (
                                            <li
                                                className={`flex flex-row cursor-pointer overflow-hidden font-mono lg:text-[20px] sm:text-[12px] font-bold`}
                                                key={user.id}
                                                onClick={() => {
                                                    setselectedUser(user._id);
                                                    handleViewChange('second');
                                                }}
                                            >
                                                <img
                                                    className='lg:h-[25px] min-[320px]:h-[20px] mt-[3px] rounded-full m-[3px] mr-4'
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
                    )}
                    <div className="h-full w-full border-2 border-black">
                        <PeopleList
                            setMessages={setMessages}
                            handleViewChange={handleViewChange}
                            People={People}
                            setselectedUser={setselectedUser}
                            lastMessageTimes={lastMessageTimes}
                        />
                    </div>
                </div>
            ) : null}

            {isLargeScreen || currentView === 'second' ? (
                selectedUser ? (
                    <div className="w-full md:w-2/3 h-full flex flex-col">
                        <div className="h-[100px] border-2 w-full border-black flex items-center">
                            <div onClick={() => handleViewChange('first')} className="bg-black p-1 cursor-pointer">
                                <img src={backarrow} alt="Back Arrow" className='h-12 w-12' />
                            </div>
                            <div className="flex items-center justify-center ml-[200px]">
                                <OtherPerson name={selectedUserName} />
                            </div>
                        </div>
                        <div className="h-full border-2 overflow-hidden border-black">
                            <Chat messages={messages} selectedUser={selectedUser} />
                        </div>
                        <div className="h-[75px] border-2 border-black">
                            <MessageBox sendMessage={sendMessage} newMessage={newMessage} setnewMessage={setnewMessage} />
                        </div>
                    </div>
                ) : (
                    <div className="w-full md:w-2/3 h-full flex flex-col">
                        <NoChat />
                    </div>
                )
            ) : null}
        </div>
    );
}

export default Chats;
