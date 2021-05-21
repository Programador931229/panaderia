const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM empleados;', (err, empleados) => {
            if (err){
                res.json(err);
            }
            res.render('empleados', {
                data: empleados
            });
        });
    });
};

module.exports = controller;