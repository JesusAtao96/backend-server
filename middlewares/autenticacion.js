var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==========================================================
// Verificar tokem
// ==========================================================
exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};


// ==========================================================
// Verificar ADMIN
// ==========================================================
exports.verificaAdminRole = function(req, res, next) {
    const usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: { message: 'El usuario no tiene permitida esta acción' }
        });
    }
};


// ==========================================================
// Verificar ADMIN o Mismo Usuario
// ==========================================================
exports.verificaAdminRoleMismoUsuario = function(req, res, next) {
    const usuario = req.usuario;
    const id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: { message: 'El usuario no tiene permitida esta acción' }
        });
    }
};