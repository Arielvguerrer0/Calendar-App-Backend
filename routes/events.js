/* 
    Events Router
    /api/events

*/

const { Router } = require('express');
const { check } = require('express-validator')
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos , crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events')
const router = Router();

const { isDate } = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validar-campos')
// todas las funciones deben pasar por la validacion del JWT
router.use( validarJWT );

router.get('/',
    getEventos );

router.post('/new',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha final es obligatoria').custom(isDate),
        validarCampos     
    ],
    crearEvento );

router.put('/:id',
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha final es obligatoria').custom(isDate),
    validarCampos,
    actualizarEvento );

router.delete('/:id',
    validarCampos,
    eliminarEvento );


module.exports = router;



