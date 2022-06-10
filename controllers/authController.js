const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, resp = response) => {

    const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({email});
        
        if(!usuarioDB){
            resp.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado!'
            });
        }
       
        
        // ToDo verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        
        if(!validPassword){
            resp.status(400).json({
                ok: false,
                msg: 'Contraseña no valida!'
            });
        }

        // Generar Token JWT
        const token = await generarJWT(usuarioDB.id)

        resp.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Ha habido un error, hable con el administrador!'
        })
    }
}

module.exports = {
    login
}