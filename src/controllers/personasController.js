const bcryptjs = require('bcryptjs');
const { render } = require("ejs");

const controller = {};

controller.personas = (req, res)=>{
    req.getConnection((err, conn)=>{
        conn.query('SELECT id_ciudad, nombre_ciudad FROM ciudades', (err, ciudades)=>{
            if(ciudades){
                conn.query('SELECT id_genero, nombre_genero FROM genero', (err, generos)=>{
                    res.render('personas', {
                        data1: ciudades,
                        data2: generos
                    })
                })
            }
        });
    });
};

controller.agregarPersona = (req, res) =>{
    const nombre = req.body.nombre;
    const apellido_p = req.body.apellido_paterno;
    const apellido_m = req.body.apellido_materno;
    const codigo = req.body.codigo_postal;
    const genero =req.body.id_genero;
    const tipo = req.body.tipo; 
    
    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO personas(nombre, apellido_paterno, apellido_materno, codigo_postal, id_genero) VALUES(?, ?, ?, ?, ?);', 
        [nombre, apellido_p, apellido_m, codigo, genero], (err, persona)=>{
            conn.query('SELECT MAX(id_persona) as id FROM personas;', (err, id)=>{
                if(tipo == 1){
                    conn.query('SELECT * FROM turnos;', (err, turnos)=>{
                        res.render('empleados', {
                            data: id[0],
                            data2: turnos
                        })
                    })
                }else{
                    conn.query('SELECT * FROM empresas', (err, empresas)=>{
                        res.render('proveedores', {
                            data1: id[0],
                            data2: empresas
                        })
                    })
                }
            })
        })
    })
};

controller.agregarEmpleado = (req, res) =>{
    const empleado = req.body; 
    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO empleados set ?', [empleado], (err, empleado)=>{
            conn.query('SELECT * FROM roles', (err, roles)=>{
                conn.query('SELECT MAX(id_empleado) as id FROM empleados;', (err, id)=>{
                    res.render('registro', {
                        data1: roles,
                        data2: id[0],
                        data3: true
                    })
                })
            })
        })
    })
}

controller.agregarProveedor = (req, res)=>{
    const proveedor = req.body;
    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO proveedor set ?', [proveedor], (err, proveedor)=>{
            res.redirect('/principal');
        })
    })
}

controller.registrarUsuario = (req, res) =>{
    const rol = req.body.id_rol;
    const empleado = req.body.id_empleado;
    const nombre = req.body.nombre_usuario;
    const correo = req.body.correo;
    const clave = req.body.clave;
    const cryptoClave = bcryptjs.hashSync(clave, 8);
    console.log(cryptoClave);
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, usuarios)=>{
            if(usuarios.length > 0){
                conn.query('SELECT * FROM roles', (err, roles)=>{
                    conn.query('SELECT MAX(id_empleado) as id FROM empleados;', (err, id)=>{
                        res.render('registro', {
                            data1: roles,
                            data2: id[0],
                            data3: false
                        })
                    })
                })
            }
            else{
                conn.query('INSERT INTO usuarios set ?', {id_rol: rol, id_empleado: empleado, nombre_usuario: nombre, correo: correo, clave: cryptoClave}, (err, usuario) => {
                    console.log(usuario);
                   res.redirect('/');
                });
            }
        });
    });
};

controller.listaEmpleados = (req, res) =>{
    req.getConnection((err, conn)=>{
        conn.query('select e.id_empleado, p.nombre, p.apellido_paterno, p.apellido_materno, t.nombre_turno, t.hora_entrada, t.hora_salida, r.nombre_roll, e.fecha_ingreso from empleados as e inner join personas as p on e.id_persona = p.id_persona inner join turnos as t on e.id_turno = t.id_turno inner join usuarios as u on e.id_empleado = u.id_empleado inner join roles as r on u.id_rol = r.id_rol;',
        (err, empleados)=>{
            console.log(empleados);
            res.render('empleados_list', {
                data: empleados
            })
        })
    })
}

controller.listaProveedores = (req, res) =>{
    req.getConnection((err, conn)=>{
        conn.query('select k.id_proveedor, p.nombre, p.apellido_paterno, p.apellido_materno, e.nombre_empresa, k.tipo_cargamento from proveedor as k inner join personas as p on k.id_persona = p.id_persona inner join empresas as e on k.id_empresa = e.id_empresa',
        (err, proveedores)=>{
            res.render('proveedores_list', {
                data: proveedores
            })
        })
    })
}

controller.listaUsuarios = (req, res)=>{
    req.getConnection((err, conn)=>{
        conn.query('select u.id_usuario, u.id_empleado, u.nombre_usuario, u.correo, r.nombre_roll, u.clave from usuarios as u inner join roles as r on u.id_rol = r.id_rol', (err, usuarios)=>{
            res.render('usuarios', {
                data: usuarios
            })
        })
    })
}

controller.editarUsuario = (req, res)=>{
    const usuarioID = req.session.usuario; 
    req.getConnection((err, conn)=>{
        conn.query('select * from usuarios where id_usuario = ?', [usuarioID], (err, usuario)=>{
            res.render('usuarios_edit',{
                data: usuario[0],
                data2: true
            })
        })
    })
}

controller.modificarUsuario = (req, res)=>{
    const usuario = req.body.id_usuario;
    const nombre = req.body.nombre_usuario;
    const correo = req.body.correo;
    const clave = req.body.clave; 
    const cryptoClave = bcryptjs.hashSync(clave, 8);

    const _usuario = {nombre_usuario: nombre, correo: correo, clave: cryptoClave};

    req.getConnection((err, conn)=>{
        conn.query('select * from usuarios WHERE correo = ? AND id_usuario != ?', [correo, usuario], (err, usuarios)=>{
            if(usuarios.length > 0){
                const usuarioID = req.session.usuario; 
                    conn.query('select * from usuarios where id_usuario = ?', [usuarioID], (err, usuario)=>{
                        res.render('usuarios_edit',{
                            data: usuario,
                            data2: false
                        })
                    })
            }
            else{
                req.session.nombre = nombre;
                req.session.correo = correo;
                conn.query('UPDATE usuarios set ? WHERE id_usuario = ?', [_usuario, usuario], (err, row)=>{
                    res.render('principal', {
                        login: true,
                        empleado: req.session.empleado,
                        correo: req.session.correo,
                        usuario: req.session.usuario,
                        nombre: req.session.nombre,
                        rol: req.session.rol
                    });
                })
            }
        })
    })
}

module.exports = controller;

