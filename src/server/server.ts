import dotenv from 'dotenv';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import authMiddleware from 'middlewares/authMiddleware';
import authRoutes from 'routes/authRoutes';
import apiRoutes from 'routes/apiRoutes';

const config = dotenv.config().parsed!;

const DEFAULT_CORS_POLICY: CorsOptions = {
  origin: config.SERVER_ALLOWED_ORIGINS!.split(' '),
  credentials: true,
};

const server = express();

server.use(cors(DEFAULT_CORS_POLICY));
server.use(cookieParser());
server.use(express.json());

server.use('/auth', authRoutes);
server.use('/api', authMiddleware, apiRoutes);

export default server;
