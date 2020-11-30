const Enlace = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {    

    // revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }       

    //Crear el objeto de la DB
    const { nombre_original, password } = req.body;

    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombre_original = nombre_original;

    //revisa si el usuario esta autenticado
    if(req.usuario) {
        const { password, descargas } = req.body

        //asignar a enlace el numero de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        //asignar un password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        //asignar el autor
        enlace.autor = req.usuario.id
    }

    //almacenar el enlace en la DB
    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}`});
        next();
    } catch (error) {
        console.log(error);
    }

}

exports.obtenerEnlace = async (req, res, next) => {
    // console.log(req.params.url);
    const { url } = req.params;

    //verificar si existe el enlace
    const enlace = await Enlace.findOne({ url });

    //si no existe
    if(!enlace) {
        res.status(404).json({ msg: 'Enlace no existe' });
        return next();
    }

    //si existe
    res.json({ archivo: enlace.nombre });

    //si las descargas son default(1), borrar la entrada y el archivo
    
    //si las descargas son > 1, restar 1

};