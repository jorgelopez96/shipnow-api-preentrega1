import bcrypt from 'bcrypt';
import { usersRepository } from '../repositories/users.repository.js';
import { AppError } from '../utils/app-error.js';

const SALT_ROUNDS = 10;

const ensureEmailIsFree = async (email, currentUserId) => {
  if (typeof email !== 'string') return;
  const existing = await usersRepository.findByEmail(email);
  if (existing && String(existing._id) !== String(currentUserId)) {
    throw new AppError(`Ya existe un usuario con el email ${email}`, 409);
  }
};

const withHashedPassword = async (data) => {
  if (typeof data.password !== 'string' || !data.password) return data;
  return { ...data, password: await bcrypt.hash(data.password, SALT_ROUNDS) };
};

export const usersService = {
  getAll() {
    return usersRepository.findAll();
  },

  async getById(id) {
    const user = await usersRepository.findById(id);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    return user;
  },

  async create(data = {}) {
    await ensureEmailIsFree(data.email);
    return usersRepository.create(await withHashedPassword(data));
  },

  async update(id, data = {}) {
    await ensureEmailIsFree(data.email, id);
    const user = await usersRepository.updateById(id, await withHashedPassword(data));
    if (!user) throw new AppError('Usuario no encontrado', 404);
    return user;
  },

  async remove(id) {
    const user = await usersRepository.deleteById(id);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    return user;
  },
};
