const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

exports.nuevoUsuario = async (req, res) => {

    //verificar si el email del usuario ya esta registrado
    const { email, password } = req.body;

    try {
        
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya está registrado!' });
        } 
        
        //Crear el nuevo usuario
        usuario = new Usuario(req.body)

        //Hashear el password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        //Guardar el usuario en la DB
        await usuario.save();
        res.json({msg: 'Usuario creado correctamente'});   

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }


}
