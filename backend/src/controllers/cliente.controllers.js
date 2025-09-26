const { pool } = require("../db.js");
require('dotenv').config();

const getCliente = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM cliente');
  res.json(rows);
};


const deleteCliente = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('DELETE FROM cliente WHERE id_cliente = $1 RETURNING *', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'cliente no encontrado' });
  }
  res.json({ message: 'cliente eliminado', user: rows[0] });
};

const createCliente = async (req, res) => {
  try {
    const {nombre_cliente,rut_cliente,estatus} = req.body;

    /* que no se te olvide agregar cartera_comercial_asig */
    const { rows } = await pool.query(`
  INSERT INTO cliente (
    nombre_cliente,rut_cliente,estatus
  ) VALUES (
    $1, $2, $3) 
    RETURNING *
`, [
      nombre_cliente,rut_cliente,estatus
    ]);

    res.status(201).json({ message: 'cliente ingresado' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.detail });
  }
};


const updateCliente = async (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM cliente WHERE id_cliente = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'cliente no encontrado' });
    }

    const clienteActual = rows[0];

    // Utilidad: si el nuevo valor está vacío, conservar el anterior
    const getValor = (nuevo, actual) => {
      return (nuevo === undefined || nuevo === null || nuevo === '') ? actual : nuevo;
    };

    /* nombre_cliente,rut_cliente,estatus */

    const camposActualizados = {
      nombre_cliente: getValor(campos.nombre_cliente, clienteActual.nombre_cliente),
      rut_cliente: getValor(campos.rut_cliente, clienteActual.rut_cliente),
      estatus: getValor(campos.estatus, clienteActual.estatus)
    };
    // 3. Ejecutar el UPDATE con todos los campos
    const query = `
      UPDATE proyecto SET
        nombre_cliente = $1,
        rut_cliente = $2,
        estatus = $3,
    `;

    const values = [
      camposActualizados.nombre_cliente,
      camposActualizados.rut_cliente,
      camposActualizados.estatus,
      id
    ];

    await pool.query(query, values);

    res.status(200).json({ message: 'Proyecto actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.detail || 'Error al actualizar el proyecto' });
  }
};


module.exports = {
  getCliente,
  deleteCliente,
  createCliente,
  updateCliente
};

