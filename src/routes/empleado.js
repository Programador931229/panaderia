const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

router.get('/', empleadoController.list);
router.post('/add', empleadoController.save);
router.get('/delete/:id', empleadoController.delete);
router.get('/update/:id', empleadoController.edit);
router.post('/update/:id', empleadoController.update);


module.exports = router; 
