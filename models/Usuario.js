const {Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        // no pueden haber correos duplicados.
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
});


module.exports = model('Usuario', UsuarioSchema);