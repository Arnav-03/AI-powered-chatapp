const mongoose = require("mongoose");


const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    day: String,
    time: String,
    file: {
        name: String,
        link: String,
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});



// Pre-hook to populate day and time before saving
MessageSchema.pre('save', function (next) {
    const date = new Date(this.createdAt);
    this.day = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    this.time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    next();
});

const MessageModel = mongoose.model('Message', MessageSchema);
module.exports = MessageModel;

