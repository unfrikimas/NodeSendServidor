const express = require('express');
const conectarDB = require('./config/db');

//crear el servidor
const app = express();

//conectar a la DB
conectarDB();

//puerto de la app
const port = process.env.PORT || 4000;

//habilitar poder leer los valores de un body
app.use( express.json() );

//rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));

//arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor arriba en el puerto ${port}.`);
})
