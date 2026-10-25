import mongoose from 'mongoose';
import { config } from '../config/env.config.js';

const toHttpError = (err) => {
  if (err.statusCode) return { status: err.statusCode, message: err.message };
  if (err instanceof mongoose.Error.CastError) return { status: 400, message: `ID inválido: ${err.value}` };
  if (err instanceof mongoose.Error.ValidationError) return { status: 400, message: err.message };
  if (err.code === 11000) return { status: 409, message: `Valor duplicado: ${Object.keys(err.keyValue).join(', ')}` };
  if (err.type === 'entity.parse.failed') return { status: 400, message: 'JSON inválido en el body' };
  return { status: 500, message: 'Error interno del servidor' };
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ status: 'error', message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const { status, message } = toHttpError(err);
  if (status === 500) console.error(err);

  const body = { status: 'error', message };
  if (config.nodeEnv === 'development' && status === 500) body.detail = err.message;
  res.status(status).json(body);
};
