const Usuario = require('../models/Usuario');

exports.autenticarUsuario = async (req, res, next) => {

    //Revisar si hay errores

    //Buscar el usuario para verificar si esta registrado
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if(!usuario) {
        res.status(401).json({ msg: 'El usuario no existe' });
        return next();
    }

    //Verificar el password y autenticar el usuario

}

exports.usuarioAutenticado = (req, res) => {

}