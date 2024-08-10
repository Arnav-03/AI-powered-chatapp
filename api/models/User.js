const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, default: '' },
    username: { type: String, unique: true, default: '' },
    image: { type: String, default: '' },
    googlesignin: { type: Boolean, default: false },
    password: { type: String },
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
