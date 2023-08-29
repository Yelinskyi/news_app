const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'nickname is required'],
    unique: true,
    minLength: 3,
    maxLength: 20
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    match: [/^\S+@\S+$/g, 'invalid email format'],
    minLength: 3,
    maxLength: 40
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: 4,
    maxLength: 128
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
