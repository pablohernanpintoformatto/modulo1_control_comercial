
const { getClienteContacto, deleteClienteContacto, createClienteContacto, updateClienteContacto} = require("../controllers/clienteContacto.controllers");
const Router = require('express');

const router = Router();

router.get('/clienteContacto', getClienteContacto);
router.delete('/clienteContacto/:id', deleteClienteContacto);
router.post('/clienteContacto/add', createClienteContacto);
router.put('/clienteContacto/:id', updateClienteContacto);

module.exports = router; 


