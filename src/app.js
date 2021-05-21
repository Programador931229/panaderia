 const express = require('express');
 const path = require('path');
 const app = express();
 const morgan = require('morgan');
 const mysql = require('mysql');
 const myconnection = require('express-myconnection');



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

 //Routes
 

 // starting the server


 app.listen(app.get('port'), () => {
     console.log('Server en puerto 3000');
 });
