const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personas', (err, empleado) => {
            if (err){
                res.json(err);
            }
            res.render('empleados', {
                data: empleado
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO personas set ?', [data], (err, empleado) => {
            console.log(empleado);
            res.redirect('/');
        });
    })
}

controller.edit =  (req, res) => {
    const {id} = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personas WHERE id_persona = ?', [id], (err, empleado) => {
            res.render('empleado_edit', {
                data: empleado[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const {id} = req.params;
    const newEmpleado = req.body;
    req.getConnection((err, conn) =>{
        conn.query('UPDATE personas set ? WHERE id_persona = ?', [newEmpleado, id], (err, rows) => {
            res.redirect('/');
        })
    })
}

controller.delete = (req, res) => {
    const {id} = req.params;
    console.log(id);
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM personas WHERE id_persona = ?', [id], (err, rows) => {
            res.redirect('/');
        });
    });
};

module.exports = controller;