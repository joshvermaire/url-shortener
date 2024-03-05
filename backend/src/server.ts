import express, { Express, Request, Response } from "express";
import fs from 'fs/promises'
import 'dotenv/config'

import { Routes } from "./routes";
import { DB } from './db';

const app: Express = express();
const port = process.env.PORT;
const routes = new Routes(new DB());

app.use(express.json());

app.post('/api/create-short-url', routes.validateRequestBody, routes.createShortUrl);
app.get('/:shortUrl', routes.getShortUrl);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});