const express = require('express');
const router = express.Router();
const inicioController = require('../controllers/inicioController');
const almacenController = require('../controllers/almacenController');

//Rutas de Inicio de Sesión

router.get('/', inicioController.start);
router.post('/entrar', inicioController.logIn);
router.get('/registro', inicioController.signUp);
router.post('/registrar', inicioController.save);
router.get('/principal', inicioController.principal);

//Rutas de Almacen
router.get('/almacen', almacenController.alamacen);
router.post('/agregarMateria', almacenController.agregarMateria);
router.get('/editarMateria/:id', almacenController.editarMateria);
router.get('/eliminarMateria/:id', almacenController.eliminarMateria);
router.post('/actualizarMateria/:id', almacenController.actualizarMateria);



module.exports = router; 