const {response} = require('express');
const Evento = require('../models/Evento');


const getEventos = async ( req, res = response ) => {



    const eventos = await Evento.find()
                                .populate('user','name');


    return res.status(200).json({
        ok: true,
        eventos
    })
};

const crearEvento = async ( req, res = response ) => {


    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;

         const eventoGuardado = await evento.save()

         res.status(201).json({
             msg: true,
             evento: eventoGuardado
         })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el adm'
        })
    }

};
const actualizarEvento = async ( req, res = response ) => {

    const eventoId = req.params.id;

    const uid = req.uid;    

    try {
        const evento = await Evento.findById( eventoId );
        
        if( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe un evento con el ID'
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        // primero enviamos el id, despues el evento y utilizamos la configuracion new en true para que la respuesta muestre el evento actualizado.
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true});

        res.json({
            ok: true,
            evento: eventoActualizado
        });

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'contactese con el adm'
        });
    }

};
const eliminarEvento = async ( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    
    try {
        const evento = await Evento.findById( eventoId );

        if( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe un evento con el ID'
            })
        }
    
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            });
        }

        const eventoEliminado = await Evento.findByIdAndDelete(eventoId);

        res.json({
            ok: true,
            evento: eventoEliminado
        });

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'contactese con el adm'

        })
    }

};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}