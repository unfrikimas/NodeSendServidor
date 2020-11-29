const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'Password no puede ir vacío').not().isEmpty()
    ],
    authController.autenticarUsuario
);

router.get('/',
    authController.usuarioAutenticado
);

module.exports = router;