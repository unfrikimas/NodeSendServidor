const Enlace = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

exports.nuevoEnlace = async (req, res, next) => {    

    //revisar si hay errores

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