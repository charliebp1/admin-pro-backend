const { response } = require('express');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');

// getTodo
const getTodo = async(req, resp = response) => {

    const busqueda = req.params.busqueda;
    const regexp = new RegExp(busqueda, 'i');

    const [usuarios,  medicos, hospitales] = await Promise.all([
        Usuario.find({nombre:regexp}),
        Medico.find({nombre:regexp}),
        Hospital.find({nombre:regexp})
    ]);

    resp.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    }) 
}

const getDocumentosColeccion = async(req, resp = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regexp = new RegExp(busqueda, 'i');

    let data = [];

    switch(tabla) {
        case 'medicos':
            data = await Medico.find({nombre:regexp})
                               .populate('usuario', 'nombre img')
                               .populate('hospital', 'nombre img');;
            break;
        case 'hospitales':
            data = await Hospital.find({nombre:regexp})
                                 .populate('usuario', 'nombre img');
            break;
        case 'usuarios':
            data = await Usuario.find({nombre:regexp});
            break;
        default:
            return resp.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
            
    }

    resp.json({
        ok: true,
        resultados: data
    })
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}