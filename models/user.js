const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  date: {
    type: String,
  },
});

module.exports = mongoose.model('user', userSchema);
