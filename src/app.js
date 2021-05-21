 const express = require('express');
 const app = express();

 //configuraciones 
 app.set('port', process.env.PORT || 3000);

 
 app.listen(app.get('port'), () => {
     console.log('Server en puerto 3000');
 });
