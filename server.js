import mongoose from 'mongoose';
import { config } from './src/config/env.config.js';
import app from './src/app.js';

try {
  await mongoose.connect(config.mongoUri);
  console.log('Conectado a MongoDB');
  app.listen(config.port, () => {
    console.log(`ShipNow API escuchando en el puerto ${config.port} (${config.nodeEnv})`);
  });
} catch (error) {
  console.error('No se pudo conectar a MongoDB:', error.message);
  process.exit(1);
}
