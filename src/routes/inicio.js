const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const inicioController = require('../controllers/inicioController');
const almacenController = require('../controllers/almacenController');
const productoController = require('../controllers/productoController');
const ingredienteController = require('../controllers/ingredienteController');

//Configuracion de Multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/img/productos'),
    filename: (req, file, cb) =>{
        cb(null, uuidv4() + path.extname(file.originalname));
    }
    
});

//Midelware Multer
const upload = multer({
    storage,
    dest: path.join(__dirname, '../public/img/productos'),
    limits: {filsize: 3000000},
    fileFilter: (req, file, cb) =>{
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
          } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
          }
    }
}).single('imagen');

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

//Rutas de Productos 
router.get('/productos', productoController.productos);
router.post('/agregarProducto', upload, productoController.agregarProducto);
router.get('/editarProducto/:id', productoController.editarProducto);
router.post('/actualizarProducto/:id', upload, productoController.actualizarProducto);
router.get('/eliminarProducto/:id', productoController.eliminarProducto);

//Rutas de Ingredientes
router.get('/ingredientes/:id', ingredienteController.ingredientes);
router.post('/agregarIngrediente', ingredienteController.registrarIngrediente);
router.get('/editarIngrediente/:id', ingredienteController.editarIngrediente);
router.get('/eliminarIngrediente/:id', ingredienteController.eliminarIngrediente);

module.exports = router; 