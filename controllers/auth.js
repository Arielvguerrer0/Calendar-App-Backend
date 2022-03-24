const {response} = require('express');
const brcypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response ) => {

    // extramoe la data del body 
    const { email, password } = req.body;
    try {
        // busca un usuario registrado con el email del request
        let usuario = await Usuario.findOne({ email });

        console.log(usuario)

        if( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario registrado con el correo'
            })
        }

        usuario = new Usuario( req.body );

        //Encriptar la contraseña
        const salt = brcypt.genSaltSync();
        usuario.password = brcypt.hashSync( password, salt );

        await usuario.save();
        // Generar token 

        const token =  await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el adm'
        })
    }
    
}; 

const loginUsuario = async (req, res = response ) => {

    const { email, password} = req.body;

    const usuario = await Usuario.findOne({ email });
    try {
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario registrado con ese email'
            })
        }

        //Confirmar las contraseñas
        const validPassword = brcypt.compareSync( password, usuario.password);

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token =  await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el adm'
        })
    }
};

const revalidarToken = async (req, res = response ) => {

    const { uid, name } = req;

    const token =  await generarJWT( uid, name );

    res.json({
        ok: true,
        token
    })
};


// exportamos las funciones.
module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}