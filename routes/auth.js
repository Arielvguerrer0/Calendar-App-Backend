/*
    Rutas de usuarios / Auth
    host + /api/auth
 */
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

//controladores
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');

//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


router.post(
    '/new',
    [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener almenos 6 caracteres').isLength({ min: 6 }),
        validarCampos, 
    ],
    crearUsuario,
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener almenos 6 caracteres').isLength({ min: 6 }),
        validarCampos, 
    ],
    loginUsuario
);
router.get(
    '/renew',
    [
        validarJWT
    ],
    revalidarToken );


module.exports = router;