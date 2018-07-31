const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  email: {type: String, required: true, unique: true, match: /[*]/},
  password: {type: String, required: true},
  isActive: Boolean
});

module.exports = mongoose.model('User', userSchema);
