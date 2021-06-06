const controller = {};

controller.ingredientes = (req, res)=>{
    const {id} = req.params; 
    req.getConnection((err, conn) =>{
        conn.query('SELECT i.id_ingrediente, p.nombre_producto, m.nombre_materia_prima, i.cantidad_ingrediente FROM materias_primas as m INNER JOIN ingredientes as i ON m.id_materia_prima = i.id_materia_prima INNER JOIN productos as p ON i.id_producto = p.id_producto AND p.id_producto = ?;',
         [id], (err, ingredientes)=>{
             if(err){
                conn.query('SELECT id_materia_prima, nombre_materia_prima FROM materias_primas', (err, materias) =>{
                    conn.query('SELECT nombre_producto FROM productos WHERE id_producto = ?', [id], (err, nombre)=>{
                        res.render('ingredientes', {
                            data: id,
                            data2: materias,
                            data3: nombre
                        });
                    })
                });
             }
             conn.query('SELECT id_materia_prima, nombre_materia_prima FROM materias_primas', (err, materias) =>{
                 conn.query('SELECT nombre_producto FROM productos WHERE id_producto = ?', [id], (err, nombre)=>{
                     res.render('ingredientes', {
                         data: id,
                         data1: ingredientes,
                         data2: materias,
                         data3: nombre
                     });
                 })
             });
         });
    });
};

controller.registrarIngrediente = (req, res) =>{
    const ingrediente = req.body;
    const id = req.body.id_producto;
    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO ingredientes set ?', [ingrediente], (err, registro)=>{
            res.redirect(`/ingredientes/${id}`);
        })
    })
}

controller.editarIngrediente = (req, res) =>{
    const {id} = req.params;
    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM ingredientes WHERE id_ingrediente = ?', [id], (err, ingrediente)=>{
            res.render('ingredientes_edit', {
                data: ingrediente[0]
            });
        });
    });
}

controller.eliminarIngrediente = (req, res) =>{
    const {id} = req.params;
    req.getConnection((err, conn) =>{
        conn.query('DELETE FROM ingredientes WHERE id_ingrediente = ?', [id], (err, row)=>{
            res.redirect('/productos');
        })
    })
}

module.exports = controller; 