
require('dotenv').config();

const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

// Usuario y contraseña bd
// mean_user
// ICBsMlZbNjYnBbWC

// Rutas
app.get('/', (req, resp) =>{

    resp.json({
        ok: true,
        msg: 'Hola Mundo!'
    })
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});