const controller = {};

controller.productos = (req,res)=>{
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM productos', (err, productos) =>{
            if (err){
                res.json(err);
            }
            res.render('productos', {
                data: productos
            });
        });
    });
};

controller.agregarProducto = (req, res) =>{
    const nombre = req.body.nombre_producto;
    const existencia = req.body.existencia_producto;
    const precio = req.body.precio_producto;
    const fecha = req.body.fecha_caducidad;
    const imagen = req.file.filename;

    req.getConnection((err, conn)=>{
        conn.query('INSERT INTO productos(nombre_producto, existencia_producto, precio_producto, fecha_caducidad, imagen) VALUES(?, ?, ?, ?, ?);', [nombre, existencia, precio, fecha, imagen], (err, producto)=>{
            res.redirect('/productos');
        })
    })
};

controller.editarProducto = (req, res) =>{
    const {id} = req.params; 
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM productos WHERE id_producto = ?', [id], (err, producto)=>{
            res.render('productos_edit', {
                data: producto[0]
            });
        });
    });
};

controller.actualizarProducto = (req, res) =>{
    const {id} = req.params; 
    const nombre = req.body.nombre_producto;
    const existencia = req.body.existencia_producto;
    const precio = req.body.precio_producto;
    const fecha = req.body.fecha_caducidad;
    const imagen = req.file.filename;

    const row = {
        nombre_producto: nombre,
        existencia_producto: existencia,
        precio_producto: precio,
        fecha_caducidad: fecha,
        imagen: imagen};
    
    req.getConnection((err, conn)=>{
        conn.query('UPDATE productos set ? WHERE id_producto = ?', [row, id], (err, producto) =>{
            res.redirect('/productos');
        });
    }) 
}

controller.eliminarProducto = (req, res) =>{
    const {id} = req.params;

    req.getConnection((err, conn) =>{
        conn.query('DELETE FROM productos WHERE id_producto = ?', [id], (err, row) =>{
            res.redirect('/productos');
        })
    });
};

module.exports = controller;