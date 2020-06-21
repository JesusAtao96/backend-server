const express = require('express');

const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();

var Medico = require('../models/medico');

// ==========================================================
// Obtener todos los médicos
// ==========================================================

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando médicos',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos,
                    total: conteo
                });
            });
        });
});

// ==========================================================
// Obtener médico
// ==========================================================

app.get('/:id', (req, res) => {
    const id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    nensaje: 'Error al actualizar médico',
                    errors: err
                })
            }
    
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El médico con el id ${id} no existe`,
                    errors: { message: 'No existe un médico con ese ID' }
                });
            }

            res.status(200).json({ ok: true, medico });
        });

});

// ==========================================================
// Actualizar médicos
// ==========================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                nensaje: 'Error al actualizar médico',
                errors: err
            })
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El médico con el id ${id} no existe`,
                errors: { message: 'No existe un médico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    })
})

// ==========================================================
// Crear un nuevo medico
// ==========================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado 
        });
    });
})

// ==========================================================
// Borrar un medico por el id
// ==========================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    const id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar médico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: `El médico con el id ${id} no existe`,
                errors: { message: 'No existe un médico con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    })
})


module.exports = app;