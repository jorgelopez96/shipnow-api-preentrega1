import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

for (const name of REQUIRED_VARS) {
  if (!process.env[name]) {
    throw new Error(`Falta configurar la variable de entorno: ${name}`);
  }
}

export const config = Object.freeze({
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
});
