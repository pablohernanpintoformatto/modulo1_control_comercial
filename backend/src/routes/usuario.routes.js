
const { createUsers, deleteUserById, getUsers, getUsersById, updateUsers,loginUsers } = require("../controllers/usuarios.controllers.js");
const Router = require('express');

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.delete('/users/:id', deleteUserById);
router.post('/users', createUsers);
router.put('/users/:id', updateUsers);
router.post('/users/login',loginUsers)

module.exports = router; 
