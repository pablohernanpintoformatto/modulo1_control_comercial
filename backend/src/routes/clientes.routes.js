
const { getCliente, deleteCliente, createCliente, updateCliente} = require("../controllers/cliente.controllers");
const Router = require('express');

const router = Router();

router.get('/cliente', getCliente);
router.delete('/cliente/:id', deleteCliente);
router.post('/cliente/add', createCliente);
router.put('/cliente/:id', updateCliente);

module.exports = router; 
