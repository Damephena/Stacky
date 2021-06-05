const { User, validate } = require('./user.model');

class UserService {
  async get(skip, limit) {
    try {
      return await User.find().skip(skip).limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw 'User not found';
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async persist(user) {
    try {
      if (user._id) {
        return await updateUser.bing(this)(user);
      } else {
        return await createUser.bing(this)(user);
      }
    } catch (error) {
      throw error;
    }
  }
}

async function updateUser(user) {}
async function createUser(user) {}

module.exports = UserService;
