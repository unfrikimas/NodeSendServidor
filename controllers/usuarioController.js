const Usuario = require('../models/Usuario');

exports.nuevoUsuario = async (req, res) => {

    //verificar si el email del usuario ya esta registrado
    const { email, password } = req.body;

    try {
        
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya está registrado!' });
        } 
        
        //guarda el usuario
        usuario = new Usuario(req.body)
        await usuario.save();
        res.json({msg: 'Usuario creado correctamente'});   

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }


}
