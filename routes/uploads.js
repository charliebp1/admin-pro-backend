/* 
    ruta: api/uploads/:tipo
*/

const {Router} = require('express');

const { validarJWT } = require('../middlewares/validar-jwt');
const {fileUpload, retornaImagen} = require('../controllers/uploadsController');

const expressFileUpload = require("express-fileupload");

const router = Router();

// default options
router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT,  fileUpload);

router.get('/:tipo/:foto', retornaImagen);



module.exports = router;