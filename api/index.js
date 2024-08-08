const dotenv = require("dotenv");
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const ws = require("ws");
const Message = require('./models/Message');
const User = require('./models/User');
const fs = require('fs');
mongoose.connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
const app = express();

app.use('/api/uploads', express.static(__dirname + '/uploads/'));

console.log(process.env.CLIENT_URL);

const corsOptions = {
    credentials: true,
    origin: process.env.CLIENT_URL,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

/* async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData);
            });
        } else {
            reject('no token');
        }
    })
} */
    async function getUserDataFromRequest(req) {
        return new Promise((resolve, reject) => {
            const token = req.cookies?.token;
            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err) {
                        console.log('Token verification error:', err);
                        reject('Invalid token');
                        return;
                    }
                    resolve(userData);
                });
            } else {
                console.log('No token provided');
                reject('No token provided');
            }
        });
    }
    
app.get('/api/test', (req, res) => {
    res.json('test hehhee');
});

/* app.get('/api/messages/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUSerId = userData.userId;
    const messages = await Message.find({
        sender: { $in: [userId, ourUSerId] },
        recipient: { $in: [userId, ourUSerId] },
    }).sort({ createdAt: 1 });
    res.json(messages);
}); */
app.get('/api/messages/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userData = await getUserDataFromRequest(req);
        const ourUserId = userData.userId;
        const messages = await Message.find({
            sender: { $in: [userId, ourUserId] },
            recipient: { $in: [userId, ourUserId] },
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(401).json({ error });
    }
});


app.get('/api/lastmessage/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;

    const lastMessage = await Message
        .find({
            sender: { $in: [userId, ourUserId] },
            recipient: { $in: [userId, ourUserId] },
        })
        .sort({ createdAt: -1 }) // Sort in descending order
        .limit(1);
        
    res.json(lastMessage);
});

app.get('/api/people', async (req, res) => {
    try {
        const userData = await getUserDataFromRequest(req);
        const ourUserId = userData.userId;

        const messagesSentByUser = await Message.find({ sender: ourUserId }, { recipient: 1, createdAt: 1 })
            .sort({ createdAt: -1 }); // Sorting by createdAt in descending order

        const messagesReceivedByUser = await Message.find({ recipient: ourUserId }, { sender: 1, createdAt: 1 })
            .sort({ createdAt: -1 }); // Sorting by createdAt in descending order

        const usersSentTo = messagesSentByUser.map(message => message.recipient.toString());
        const usersReceivedFrom = messagesReceivedByUser.map(message => message.sender.toString());

        const uniqueUserIds = [...new Set([...usersSentTo, ...usersReceivedFrom])];

        const users = await User.find({ _id: { $in: uniqueUserIds } }, { _id: 1, username: 1 });

        const usersSortedByTime = users.sort((a, b) => {
            const lastInteractionTimeA = Math.max(
                messagesSentByUser.find(msg => msg.recipient.toString() === a._id.toString())?.createdAt || 0,
                messagesReceivedByUser.find(msg => msg.sender.toString() === a._id.toString())?.createdAt || 0
            );

            const lastInteractionTimeB = Math.max(
                messagesSentByUser.find(msg => msg.recipient.toString() === b._id.toString())?.createdAt || 0,
                messagesReceivedByUser.find(msg => msg.sender.toString() === b._id.toString())?.createdAt || 0
            );

            return lastInteractionTimeB - lastInteractionTimeA;
        });

        res.json(usersSortedByTime);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/allpeople', async (req, res) => {
    const searchTerm = req.query.searchTerm;

    try {
        if (searchTerm && searchTerm.length > 0) {
            // Use a regular expression to perform a case-insensitive search for starting letters only
            const users = await User.find(
                { username: { $regex: new RegExp('^' + searchTerm, 'i') } },
                { _id: 1, username: 1 }
            );

            if (users.length > 0) {
                // Users matching the search term found
                res.json({ exists: true, users });
            } else {
                // No matching users found
                res.json({ exists: false, users: [] });
            }
        } else {
            // No search term provided
            res.json({ exists: false, users: [] });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* app.get('/api/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });
    } else {
        res.status(401).json('no token');
    }
}); */
app.get('/api/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.status(401).json({ error: 'Invalid token' });
            }
            res.json(userData);
        });
    } else {
        res.status(401).json('no token');
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    
    try {
        if (!foundUser) {
            throw new Error('Invalid username or password');
        }

        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (!passOk) {
            throw new Error('Invalid username or password');
        }

        jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) {
                throw err;
            }

            res.cookie('token', token, { sameSite: 'none', secure: true }).json({
                id: foundUser._id,
            });
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(401).json({ error: err.message });
    }
});


app.post('/api/logout', (req, res) => {
    res.cookie('token', '', { sameSite: 'none', secure: true }).json('logout');
});

async function checkUserExists(username) {
    try {
        const response = await axios.get(`/api/checkuser/${username}`);
        return response.data.exists;
    } catch (error) {
        console.error("Error checking user existence:", error);
        return false;
    }
}

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username: username,
            password: hashedPassword,
        });

        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) {
                throw err;
            }

            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
            });
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(400).json({ error: err.message });
    }
});

const server = app.listen(4040);

const wss = new ws.WebSocketServer({ server });
wss.on('connection', (connection, req) => {
    // Extract token from cookies
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.trim().startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err) {
                        console.error('JWT verification error:', err);
                        return; // Exit if token verification fails
                    }
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;
                    console.log('User connected:', userId, username); // Log successful connection

                    // Notify others about online people
                    messageAboutOnlinePeople();
                });
            } else {
                console.error('Token not found in cookie string.');
            }
        } else {
            console.error('Token cookie string not found.');
        }
    } else {
        console.error('No cookies found in headers.');
    }

    connection.isAlive = true;
    connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            messageAboutOnlinePeople();
            console.log('dead');
        }, 1000);
    }, 5000);

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
    });

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text, file } = messageData;
        let filename = null;
        if (file) {
            const parts = file.name.split('.');
            const ext = parts[parts.length - 1];
            filename = Date.now() + '.' + ext;
            const path = __dirname + '/uploads/' + filename;
            const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
            fs.writeFile(path, bufferData, () => {
                console.log('file saved:' + path);
            });
        }
        console.log(connection.userId);
        if (recipient && (text || file)) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
                file: file ? filename : null,
            });
            [...wss.clients]
                .filter(c => c.userId === recipient)
                .forEach(c => c.send(JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    file: file ? filename : null,
                    _id: messageDoc._id,
                })));
        }
    });

    function messageAboutOnlinePeople() {
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username })),
            }));
        });
    }

    // Notify others about online people when a new client connects
    messageAboutOnlinePeople();
});

console.log("app running on 4040");
