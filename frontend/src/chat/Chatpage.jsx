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
import * as themes from '../chat/Colors'
import Search from './Search';
import FilePreview from './FilePreview';
import { useFileContext } from '../context/FileContext';
import AI from './ai/AI';
import { AIContext } from '../context/AIContext';


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
    const [colortheme, setcolortheme] = useState("default_theme");
    const allThemes = themes;
    const {showAIoptions}=useContext(AIContext);

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

    /*     function sendMessage(e) {
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
     */


        function sendMessage(e, file = null) {
            if (e) e.preventDefault();
        
            const createdAt = new Date();
            const day = createdAt.toLocaleDateString('en-US');
            const time = createdAt.toLocaleTimeString('en-US');
            
            let fileData = null;
            if (file) {
                console.log("File data being sent:", file.name, file.link);
        
                const fileData = {
                    name: file.name,
                    link: file.link,
                    type: file.type
                };
                
                // Convert the fileData object to a JSON string
                const fileDataString = JSON.stringify(fileData);
                
        
                // Send the file message
                ws.send(JSON.stringify({
                    day,
                    time,
                    recipient: selectedUser,
                    file: fileDataString, // Correct structure
                    text: file.name,
                    isRead: false,
                    createdAt,
                }));
                
                setnewMessage('');
        
                setMessages(prev => ([
                    ...prev,
                    {
                        day,
                        time,
                        text: file.name,
                        file: fileDataString, // Correct structure
                        sender: id,
                        isRead: false,
                        recipient: selectedUser,
                        _id: Date.now(),
                        isOur: true,
                        createdAt,
                    }
                ]));
            } else {
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
        }
        
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
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };
    const [showfiless, setshowfiless] = useState(false);
    const { files } = useFileContext();
    useEffect(() => {
        if (files.length === 0) {
            setshowfiless(false);
        }
    }, [files])

    return (
        <div className='flex items-center  justify-center h-screen w-full bg-[#f0efec]'>
            {isLargeScreen || currentView === 'first' ? (
                <div className="w-full md:w-1/3 h-full flex flex-col items-center justify-center ">
                    <User username={username} />
                    <Search setSearchTerm={setSearchTerm} setselectedUserName={setselectedUserName} handleSearch={handleSearch}
                        searchTerm={searchTerm} handleViewChange={handleViewChange} setselectedUser={setselectedUser} searchResults={searchResults} />
                    <div className="h-full w-full overflow-hidden ">
                        <PeopleList
                            selectedUser={selectedUser}
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
                    <div className="w-full  md:w-2/3 h-full flex flex-col relative">
                        <div className="">
                            <OtherPerson handleViewChange={handleViewChange} setselectedUser={setselectedUser}
                                selectedUserName={selectedUserName} />
                        </div>

                        <div className="h-full border-2 mt-[90px] overflow-hidden border-[#292929] border-l-2">
                            <Chat id={id} messages={messages} selectedUser={selectedUser} />
                        </div>
                        {showAIoptions && (
                            <AI setnewMessage={setnewMessage}/>
                        )}
                        {showfiless && (
                            <FilePreview sendMessage={sendMessage} name={selectedUserName} />
                        )}
                        {!showfiless && (
                            <div className="h-[75px] fixed bottom-0 border-2 border-t-0 border-[#292929]">
                                <MessageBox setshowfiless={setshowfiless} sendMessage={sendMessage} newMessage={newMessage} setnewMessage={setnewMessage} />
                            </div>
                        )}
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
