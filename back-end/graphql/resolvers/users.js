const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateRegisterInput,
  validateLoginInput
} = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const checkAuth = require('../../util/check-auth');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Query: {
    async getProfile(_, {}, context) {
      const { username } = checkAuth(context);
      const user = await User.findOne({ username });
      const userProfile = {
        "username": user.username,
        "avatar": user.avatar,
        "bio": user.bio,
        "email": user.email
      }
      return userProfile
    }
  },
  Mutation: {
    async login(_, { username, password }) {
      let { error, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError(error);
      }

      const user = await User.findOne({ username });

      if (!user) {
        error = 'User not found';
        throw new UserInputError(error);
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        error = 'Wrong crendetials';
        throw new UserInputError(error);
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) {
      // Validate user data
      let { error, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError(error);
      }
      // TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        error = 'Username is taken';
        throw new UserInputError(error);
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        avatar: 'default.png',
        bio: '',
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      return {
        ...res._doc,
        id: res._id
      };
    }
  }
};
