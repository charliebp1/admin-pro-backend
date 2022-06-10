/*
    Path: '/api/login'
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {login} = require('../controllers/authController');
const {validarCampos} = require('../middlewares/validar-campos');
const router = Router();

// Ruta: /api/login
    router.post('/',[
        check('email', 'Debe ingresar un email valido').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    login
);

module.exports = router;