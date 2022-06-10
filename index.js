
require('dotenv').config();

const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo de body
app.use(express.json());

// Base de datos
dbConnection();

// Usuario y contraseña bd
// mean_user
// ICBsMlZbNjYnBbWC

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});