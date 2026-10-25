import { productsService } from '../services/products.service.js';

export const productsController = {
  async getAll(req, res, next) {
    try {
      const products = await productsService.getAvailable();
      res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const product = await productsService.getById(req.params.id);
      res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const product = await productsService.create(req.body);
      res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const product = await productsService.update(req.params.id, req.body);
      res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await productsService.remove(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};
