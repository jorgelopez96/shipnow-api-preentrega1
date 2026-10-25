import { productsRepository } from '../repositories/products.repository.js';
import { PRODUCT_STATUS } from '../utils/constants.js';
import { AppError } from '../utils/app-error.js';

const statusFromStock = (stock) =>
  stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;

const withStatus = ({ status, ...data } = {}) => {
  if (data.stock === undefined) return data;
  return { ...data, status: statusFromStock(data.stock) };
};

export const productsService = {
  async getAvailable() {
    const products = await productsRepository.findAll();
    return products.filter((product) => product.status === PRODUCT_STATUS.AVAILABLE);
  },

  async getById(id) {
    const product = await productsRepository.findById(id);
    if (!product) throw new AppError('Producto no encontrado', 404);
    return product;
  },

  create(data) {
    return productsRepository.create(withStatus(data));
  },

  async update(id, data) {
    const product = await productsRepository.updateById(id, withStatus(data));
    if (!product) throw new AppError('Producto no encontrado', 404);
    return product;
  },

  async remove(id) {
    const product = await productsRepository.deleteById(id);
    if (!product) throw new AppError('Producto no encontrado', 404);
    return product;
  },
};
