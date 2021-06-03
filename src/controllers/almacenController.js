const controller = {};

controller.alamacen = (req, res) =>{
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM materias_primas', (err, materia) => {
            if (err){
                res.json(err);
            }
            res.render('almacen', {
                data: materia
            });
        });
    });
};

controller.agregarMateria = (req, res) =>{
    const data = req.body;
    req.getConnection((err, conn) =>{
        conn.query('INSERT INTO materias_primas set ?', [data], (err, materia) =>{
            res.redirect('/almacen');
        });
    });
};

controller.editarMateria = (req, res) => {
    const {id} = req.params;
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM materias_primas WHERE id_materia_prima = ?', [id], (err, materia) =>{
            res.render('almacen_edit', {
                data: materia[0]
            });
        });
    });
};

controller.eliminarMateria = (req, res) =>{
    const {id} = req.params;
    req.getConnection((err, conn) =>{
        conn.query('DELETE FROM materias_primas WHERE id_materia_prima = ?', [id], (err, materia) =>{
            res.redirect('/almacen');
        });
    });
};

controller.actualizarMateria = (req, res) =>{
    const {id} = req.params;
    const nuevaMateria = req.body; 
    req.getConnection((err, conn) =>{
        conn.query('UPDATE materias_primas set ? WHERE id_materia_prima = ?', [nuevaMateria, id], (err, materia) =>{
            res.redirect('/almacen');
        });
    });
};

module.exports = controller;