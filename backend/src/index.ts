import './bd/connect.js'; 

import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import rutasPersons from './routes/person.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/usuarios', rutasPersons);
if (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
    console.log('Servidor TS corriendo en http://localhost:${PORT}');
});
}
export default app;