import { ProductModel } from '../models/product.model.js';

const DEFAULT_SORT = { createdAt: -1 };

export const productsRepository = {
  findAll(filter = {}) {
    return ProductModel.find(filter).sort(DEFAULT_SORT).lean();
  },

  findById(id) {
    return ProductModel.findById(id).lean();
  },

  async create(data) {
    const product = await ProductModel.create(data);
    return product.toObject();
  },

  updateById(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();
  },

  deleteById(id) {
    return ProductModel.findByIdAndDelete(id).lean();
  },
};
