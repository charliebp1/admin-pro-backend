
const {Router} = require('express');
const {check} = require('express-validator');
const {getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario} = require('../controllers/usuariosController');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

// Ruta: /api/usuarios
router.get('/', validarJWT, getUsuarios);

router.post('/',[
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'Debe ingresar un email valido').isEmail(),
        validarCampos,
    ],
    crearUsuario
);

router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        check('email', 'Debe ingresar un email valido').isEmail(),
        validarCampos,
    ], actualizarUsuario
);

router.delete('/:id', 
    validarJWT,    
    borrarUsuario
);

module.exports = router;