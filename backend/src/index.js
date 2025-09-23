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
app.use('/api', usersRoutes); // accedés a /api/users

const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro'; // ideal en .env



// Ruta para registrar un usuario (solo para pruebas, puedes eliminarla luego)
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar', details: err.message });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Token requerido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Ejemplo de ruta protegida
app.get('/api/protegida', verifyToken, (req, res) => {
  res.json({ message: 'Ruta protegida accedida correctamente', user: req.user });
});



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
