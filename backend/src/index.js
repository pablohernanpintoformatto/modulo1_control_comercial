const express = require('express');
const cors = require('cors');
const { pool } = require('./db.js');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.json());



const usersRoutes = require('./routes/usuario.routes.js');
const dataProyecto = require('./routes/dataProyecto.routes.js')
const clienteRoutes = require('./routes/clientes.routes.js')
const clientesContactos = require('./routes/clientesContactos.routes.js')


app.use('/api', usersRoutes); 
app.use('/api', dataProyecto); 
app.use('/api', clienteRoutes);
app.use('/api', clientesContactos);



app.get('/', (req, res) => {
  res.send('Backend asd123!');
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Conexión exitosa a la base de datos', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos', details: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
