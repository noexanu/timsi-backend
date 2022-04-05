import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import server from 'server/server';

const config = dotenv.config().parsed!;

createConnection();
server.listen(config.SERVER_PORT!);
