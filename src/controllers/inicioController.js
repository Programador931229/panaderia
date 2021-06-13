const bcryptjs = require('bcryptjs');
const controller = {};

controller.start = (req, res) =>{
    res.render('inicio');
};

controller.logIn = (req, res) =>{
    const correo = req.body.correo;
    const clave = req.body.clave;
    const cryptoClave = bcryptjs.hashSync(clave, 8);
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) =>{
            if(results.length == 0 || !(bcryptjs.compareSync(clave, results[0].clave))){
                res.render('inicio', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error de autenticación",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                })
            }
            else{
                req.session.correo = results[0].correo;
                req.session.empleado = results[0].id_empleado;
                req.session.usuario = results[0].id_usuario;
                req.session.nombre = results[0].nombre_usuario;
                req.session.rol = results[0].id_rol;
                req.session.validado = true; 
                res.render('inicio', {
                    alert: true,
                    alertTitle: "Operación exitosa",
                    alertMessage: "Éxito al iniciar sesión",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'principal'
                })
            }
        });
    });
};

controller.principal = (req, res) =>{
    if(req.session.validado){
        res.render('principal', {
            login: true,
            empleado: req.session.empleado,
            correo: req.session.correo,
            usuario: req.session.usuario,
            nombre: req.session.nombre,
            rol: req.session.rol
        });
    }
}

controller.signUp = (req, res) =>{
    res.render('registro');
};

controller.save = (req, res) =>{
    const nombre = req.body.nombre_usuario;
    const correo = req.body.correo;
    const clave = req.body.clave;
    const cryptoClave = bcryptjs.hashSync(clave, 8);
    console.log(cryptoClave);
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO usuarios set ?', {nombre_usuario: nombre, correo: correo, clave: cryptoClave}, (err, usuario) => {
            console.log(usuario);
            res.redirect('/');
        });
    });
};

controller.salir = (req, res) =>{
    req.session.destroy(() =>{
        res.redirect('/');
    })
}

module.exports = controller;