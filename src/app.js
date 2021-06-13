const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myconnection = require('express-myconnection');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
const sesion = require('express-session');

dotenv.config({path:'./env/.env'});

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
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     port: process.env.DB_PORT,
     database: process.env.DB_DATABASE
 }, 'single'));
 app.use(express.urlencoded({extended: false}));
 
 
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
     console.log('http://localhost:3000/');
 });