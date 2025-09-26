const { pool } = require("../db.js");
require('dotenv').config();


const getClienteContacto = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM cliente_contacto');
  res.json(rows);
};


const deleteClienteContacto = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('DELETE FROM cliente_contacto WHERE id_cliente_contacto = $1 RETURNING *', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'contacto de cliente no encontrado' });
  }
  res.json({ message: 'Contacto de cliente  eliminado', user: rows[0] });
};

const createClienteContacto = async (req, res) => {
  try {
    const { nombre_cliente_contacto, cargo_cliente_contacto, correo_corporativo_cliente_contacto, correo_personal_cliente_contacto,
      telefono_personal_cliente_contacto, telefono_corporativo_cliente_contacto } = req.body;

    /* que no se te olvide agregar cartera_comercial_asig */
    const { rows } = await pool.query(`
  INSERT INTO cliente_contacto (
    nombre_cliente_contacto, cargo_cliente_contacto, correo_corporativo_cliente_contacto, correo_personal_cliente_contacto,
 telefono_personal_cliente_contacto, telefono_corporativo_cliente_contacto
  ) VALUES (
    $1, $2, $3, $4, $5, $6) 
    RETURNING *
`, [
      nombre_cliente_contacto, cargo_cliente_contacto, correo_corporativo_cliente_contacto, correo_personal_cliente_contacto,
      telefono_personal_cliente_contacto, telefono_corporativo_cliente_contacto
    ]);

    res.status(201).json({ message: 'Contacto de cliente ingresado' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.detail });
  }
};


const updateClienteContacto = async (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM cliente_contacto WHERE id_cliente_contacto = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Contacto de cliente no encontrado' });
    }

    const clienteActual = rows[0];

    // Utilidad: si el nuevo valor está vacío, conservar el anterior
    const getValor = (nuevo, actual) => {
      return (nuevo === undefined || nuevo === null || nuevo === '') ? actual : nuevo;
    };


    const camposActualizados = {
      nombre_cliente_contacto: getValor(campos.nombre_cliente_contacto, clienteActual.nombre_cliente_contacto),
      cargo_cliente_contacto: getValor(campos.cargo_cliente_contacto, clienteActual.cargo_cliente_contacto),
      correo_corporativo_cliente_contacto: getValor(campos.correo_corporativo_cliente_contacto, clienteActual.correo_corporativo_cliente_contacto),
      correo_personal_cliente_contacto: getValor(campos.correo_personal_cliente_contacto, clienteActual.correo_personal_cliente_contacto),
      telefono_personal_cliente_contacto: getValor(campos.telefono_personal_cliente_contacto, clienteActual.telefono_personal_cliente_contacto),
      
      telefono_corporativo_cliente_contacto: getValor(campos.telefono_corporativo_cliente_contacto, clienteActual.telefono_corporativo_cliente_contacto)

    };
    // 3. Ejecutar el UPDATE con todos los campos
    const query = `
      UPDATE cliente_contacto SET
        nombre_cliente_contacto = $1,
        cargo_cliente_contacto = $2,
        correo_corporativo_cliente_contacto = $3,
        correo_personal_cliente_contacto = $4,
        telefono_personal_cliente_contacto = $5,
        telefono_corporativo_cliente_contacto = $6,
    `;

    const values = [
      camposActualizados.nombre_cliente_contacto,
      camposActualizados.cargo_cliente_contacto,
      camposActualizados.correo_corporativo_cliente_contacto,
      camposActualizados.correo_personal_cliente_contacto,
      camposActualizados.telefono_personal_cliente_contacto,
      camposActualizados.telefono_corporativo_cliente_contacto,
      id
    ];

    await pool.query(query, values);

    res.status(200).json({ message: 'Contacto de cliente actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.detail || 'Error al actualizar el Contacto de cliente' });
  }
};


 
module.exports = {
  getClienteContacto,
  deleteClienteContacto,
  createClienteContacto,
  updateClienteContacto
};

