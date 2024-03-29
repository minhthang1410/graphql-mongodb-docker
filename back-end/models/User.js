const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  avatar: String,
  bio: String,
  createdAt: String
});

module.exports = model('User', userSchema);