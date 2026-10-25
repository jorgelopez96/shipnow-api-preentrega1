import { UserModel } from '../models/user.model.js';

const PUBLIC_FIELDS = '-password';
const DEFAULT_SORT = { last_name: 1, first_name: 1 };

export const usersRepository = {
  findAll(filter = {}) {
    return UserModel.find(filter, PUBLIC_FIELDS).sort(DEFAULT_SORT).lean();
  },

  findById(id) {
    return UserModel.findById(id, PUBLIC_FIELDS).lean();
  },

  findByEmail(email) {
    return UserModel.findOne({ email: email.toLowerCase().trim() }, '_id').lean();
  },

  async create(data) {
    const user = await UserModel.create(data);
    const { password, ...publicUser } = user.toObject();
    return publicUser;
  },

  updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
      projection: PUBLIC_FIELDS,
    }).lean();
  },

  deleteById(id) {
    return UserModel.findByIdAndDelete(id, { projection: PUBLIC_FIELDS }).lean();
  },
};
