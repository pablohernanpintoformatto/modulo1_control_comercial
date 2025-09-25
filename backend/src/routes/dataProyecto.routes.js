
const { getDataProyecto, deleteDetDataProyecto, createDataProyecto, updateDataProyectoUsers} = require("../controllers/dataProyecto.controllers");
const Router = require('express');

const router = Router();

router.get('/dataProyecto', getDataProyecto);
router.delete('/dataProyecto/:id', deleteDetDataProyecto);
router.post('/dataProyecto/add', createDataProyecto);
router.put('/dataProyecto/:id', updateDataProyectoUsers);

module.exports = router; 
