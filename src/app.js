import express from 'express';
import productsRouter from './routes/products.router.js';
import usersRouter from './routes/users.router.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
