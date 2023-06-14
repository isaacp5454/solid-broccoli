const { User } = require('../models'); // Import your Mongoose models or schemas here
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    // Define your query resolvers here
    
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    // Define your mutation resolvers here
    addUser: async (_, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);

        return { token, user };
      } catch (error) {
        throw new Error('Failed to create user');
      }
    },
    login: async ({ email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No profile with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async ( { input }, context) => {
			if (context.user) {
				const user = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { savedBooks: input } },
					{ new: true, runValidators: true }
				);

				return user;
			}
			throw new AuthenticationError("Please log in.");
		},
    removeBook: async ( { bookId }, context) => {
			if (context.user) {
				const user = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId } } },
					{ new: true }
				);

				return user;
			}
			throw new AuthenticationError("Please log in.");
		},
  },
};

module.exports = resolvers;