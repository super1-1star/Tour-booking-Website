const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'plse provide valid email']
  },
  photo: String,

  password: {
    type: String,
    required: [true, 'passoword is required'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'comfirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      }
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;