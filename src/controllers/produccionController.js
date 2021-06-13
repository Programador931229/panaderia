const controller = {};

controller.produccion = (req, res)=>{
    const id = req.session.empleado;
    console.log(id);
    req.getConnection((err, conn)=>{
      conn.query('SELECT id_producto, nombre_producto FROM productos;', (err, productos)=>{
          res.render('produccion', {
              data:productos,
              id:id
          })
      })  
    })
}

controller.agregarProduccion = (req, res)=>{
    const fecha = req.body.fecha_produccion;
    const empleado = req.body.id_empleado;
    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO producciones set ?',{fecha_produccion: fecha, id_empleado: empleado},(err, registro)=>{
            conn.query('SELECT MAX(id_produccion) as id FROM producciones;', (err, id)=>{
                conn.query('SELECT id_producto, nombre_producto FROM productos', (err, productos)=>{
                    res.render('detalle_produccion', {
                        id: id[0],
                        data: productos
                    })
                })
            })
        })
    })
}

controller.producirPan = (req, res)=>{
    const produccion = req.body.id_produccion;
    const producto = req.body.id_producto;
    const cantidad = req.body.cantidad_producto;
    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO detalle_produccion set ?', {id_produccion: produccion, id_producto: producto, cantidad_producto: cantidad},(err, registro)=>{
            conn.query('SELECT MAX(id_produccion) as id FROM producciones;', (err, id)=>{
                conn.query('SELECT id_producto, nombre_producto FROM productos', (err, productos)=>{
                    conn.query('select id_materia_prima, cantidad_ingrediente from ingredientes where id_producto = ?', [producto], (err, ingredientes)=>{
                        conn.query('select p.id_producto, m.id_materia_prima, m.existencia_materia_prima from materias_primas as m inner join ingredientes as i on i.id_materia_prima = m.id_materia_prima inner join productos as p on i.id_producto = p.id_producto where p.id_producto = ?', [producto], (err, materias)=>{
                            for(const i in ingredientes){
                                const result = (materias[i].existencia_materia_prima - (cantidad*ingredientes[i].cantidad_ingrediente));
                                console.log(result);
                                const nueva = {existencia_materia_prima: result}
                                conn.query('UPDATE materias_primas set ? WHERE id_materia_prima = ?', [nueva, ingredientes[i].id_materia_prima]);
                            }
                            res.render('detalle_produccion', {
                                id: id[0],
                                data: productos
                            })
                        })
                    })
                })
            })
        })
    })
}

controller.produccionesList = (req, res) =>{
    req.getConnection((err, conn)=>{
        conn.query('SELECT c.id_produccion, c.fecha_produccion, p.nombre, p.apellido_paterno, p.apellido_materno FROM producciones as c inner join empleados as e on c.id_empleado = e.id_empleado inner join personas as p on e.id_persona = p.id_persona', (err, producciones)=>{
            res.render('producciones_list', {
                data: producciones
            })
        })
    })
}

controller.produccionDetalle = (req, res) =>{
    const {id} = req.params;
    req.getConnection((err, conn)=>{
        conn.query('SELECT d.id_detalle_produccion, p.nombre_producto, d.cantidad_producto FROM detalle_produccion as d inner join productos as p ON d.id_producto = p.id_producto WHERE id_produccion = ?', [id], (err, detalles)=>{
            res.render('produccion_detalle', {
                data: detalles
            })
        })
    })
}

module.exports = controller; 