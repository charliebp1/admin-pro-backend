
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, resp) =>{
    
    const desde = Number(req.query.desde || 0);
    
    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //                               .skip(desde)
    //                               .limit(5);
    // const total = await Usuario.count();
    const[usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
               .skip(desde)
               .limit(5),
        Usuario.countDocuments()
    ]);

    resp.json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
    });
}

const crearUsuario = async(req, resp = response) =>{

    const {email, password} = req.body;
    

    try {
        const existeEmail = await Usuario.findOne({email});

        if(existeEmail){
            return resp.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado!'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar Usuario
        await usuario.save();
    
        // Generar Token JWT
        const token = await generarJWT(usuario.id);

        resp.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const actualizarUsuario = async(req, resp = response) =>{

    // ToDo: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    
    try {
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return resp.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id!'
            });
        }

        // Actualizaciones
        const {password, google, email, ...campos} = req.body;
        
        if(usuarioDB.email !== email){
        
            const existeEmail = await Usuario.findOne({email});

            if(existeEmail){
                return resp.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email!'
                });
            }
        }
        
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        resp.json({
            ok: true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }  
}

const borrarUsuario = async (req, resp = response) => {
    const uid = req.params.id;
    
    try {
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return resp.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id!'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        resp.json({
            ok: true,
            msg: 'Usuario borrado correctamente!'
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
    
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}