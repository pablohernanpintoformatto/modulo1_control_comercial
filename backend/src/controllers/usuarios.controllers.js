const { pool } = require("../db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 


const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro';

const getUsers = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users');
  res.json(rows); 
};

const loginUsers = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: err.message });
  }
}

const getUsersById = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(rows[0]); 
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.json({ message: 'Usuario eliminado', user: rows[0] }); // ✅ agregamos respuesta
};

const createUsers = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { rows } = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(rows[0]); 
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ message: 'E-mail already exists' });
    }
    console.log(error);
    return res.status(500).json({ message: error.detail });
  }
};

const updateUsers = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const { rows } = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.json(rows[0]); 
};

module.exports = {
  getUsers,
  getUsersById,
  deleteUserById,
  createUsers,
  updateUsers,
  loginUsers
};
