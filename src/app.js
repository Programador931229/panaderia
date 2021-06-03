 const express = require('express');
 const path = require('path');
 const morgan = require('morgan');
 const mysql = require('mysql');
 const myconnection = require('express-myconnection');
 const bcryptjs = require('bcryptjs');
 const dotenv = require('dotenv');
 const sesion = require('express-session');
 
 const app = express();

 //import Routes
 const inicioRoutes = require('./routes/inicio');
 const { urlencoded } = require('express');

 //configuraciones 
 app.set('port', process.env.PORT || 3000);
 app.set('view engine', 'ejs');
 app.set('views', path.join(__dirname, 'views'));
 
 //Middlewares
 app.use(morgan('dev'));
 app.use(myconnection(mysql, {
     host: 'localhost',
     user: 'root',
     password: '',
     port: 3306,
     database: 'panaderia'
 }, 'single'));
 app.use(express.urlencoded({extended: false}));
 dotenv.config({path:'./env/.env'});
 
 app.use(sesion({
     secret: 'secret',
     resave: true,
     saveUninitialized: true
 }));

 //Routes
 app.use('/', inicioRoutes);

 //static files
 app.use(express.static(path.join(__dirname, 'public')));
 
 // starting the server
 app.listen(app.get('port'), () => {
     console.log('Server en puerto 3000');
 });