const {Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // no pueden haber correos duplicados.
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
});


module.exports = model('Usuario', UsuarioSchema);