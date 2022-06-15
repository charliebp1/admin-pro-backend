const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const {actualizarImagen} = require('../helpers/actualizar-imagen');

const fileUpload = (req, resp = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if(!tiposValidos.includes(tipo)){
        return resp.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Procesar la imagen...
    const file = req.files.imagen;
    
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if(!extensionesValidas.includes(extensionArchivo)){
        return resp.status(400).json({
            ok: false,
            msg: 'La extensión del archivo no es válida.'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar archivo
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen con el método mv() 
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return resp.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            })
        }
        
        // Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        resp.json({
            ok: true,
            msg: 'Archivo subido!',
            nombreArchivo
        });
    });
}

const retornaImagen = (req, resp = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Imagen por defecto
    if(fs.existsSync(pathImg)){
        resp.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        resp.sendFile(pathImg);
    }
    
}

module.exports = {
    fileUpload,
    retornaImagen
}