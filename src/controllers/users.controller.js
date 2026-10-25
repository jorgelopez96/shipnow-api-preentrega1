import { usersService } from '../services/users.service.js';

export const usersController = {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await usersService.getById(req.params.id);
      res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const user = await usersService.create(req.body);
      res.status(201).json({ status: 'success', payload: user });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const user = await usersService.update(req.params.id, req.body);
      res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await usersService.remove(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};
