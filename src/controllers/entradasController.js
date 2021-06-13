const controller = {};

controller.entradas = (req, res)=>{
    req.getConnection((err, conn)=>{
        conn.query('SELECT p.id_proveedor, e.nombre_empresa  FROM proveedor as p inner join empresas as e on p.id_empresa = e.id_empresa;', (err, proveedores)=>{
            res.render('entradas', {
                data1: req.session.empleado,
                data2: proveedores
            })
        })
    })
}

controller.agregarEntrada = (req, res) =>{
    const entrada = req.body; 
    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO entradas set ?', [entrada], (err, registro)=>{
            conn.query('SELECT MAX(id_entrada) as id FROM entradas', (err, id)=>{
                conn.query('SELECT id_materia_prima, nombre_materia_prima FROM materias_primas', (err, materias)=>{
                    res.render('detalle_entrada', {
                        data1: id[0],
                        data2: materias
                    })
                })
            })
        })
    })
}

controller.detalleEntrada = (req, res) =>{
    const entrada = req.body;
    const id_materia = req.body.id_materia_prima;
    const cantidad1 = req.body.cantidad_entrada;
    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO detalle_entrada set ?', [entrada], (err, registro)=>{
            conn.query('SELECT MAX(id_entrada) as id FROM entradas', (err, id)=>{
                conn.query('SELECT id_materia_prima, nombre_materia_prima FROM materias_primas', (err, materias)=>{
                    conn.query('SELECT * FROM materias_primas WHERE id_materia_prima = ?;', [id_materia], (err, id_m)=>{
                        const cantidad2 = id_m[0].existencia_materia_prima;
                        const result = parseFloat(cantidad1) + parseFloat(cantidad2);
                        const nueva = {existencia_materia_prima: result}
                        conn.query('UPDATE materias_primas set ? WHERE id_materia_prima = ?', [nueva, id_materia]);
                        res.render('detalle_entrada', {
                            data1: id[0],
                            data2: materias
                        })
                    })
                })
            })
        })
    })
}

controller.entradasList = (req, res) =>{
    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM entradas', (err, entradas)=>{
            res.render('entradas_list', {
                data: entradas
            })
        })
    })
}

controller.entradaDetalle = (req, res) =>{
    const {id} = req.params;
    req.getConnection((err, conn)=>{
        conn.query('SELECT d.id_detalle_entrada, m.nombre_materia_prima, d.cantidad_entrada FROM detalle_entrada as d inner join materias_primas as m ON d.id_materia_prima = m.id_materia_prima WHERE d.id_entrada = ?', [id], (err, detalles)=>{
            res.render('entrada_detalle', {
                data: detalles
            })
        })
    })
}


module.exports = controller; 