const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../components/user/model')
const Role = require('../components/auth/model')
const response = require('../network/response')

exports.verifyToken = async (req, res, next)=>{
    try {
        const token = req.session.token
       
        if(!token) return res.render('login', {body: 'No se recibio un token valido'})
        //response.error(req, res, 400, 'No Token Provided', 'No se recibio un token valido')

        const decoded = jwt.verify(token, process.env.SECRET)

        req.userId = decoded.id

        const userFound = await User.findById(req.userId, {pass: 0})

        if(!userFound) return response.error(req, res, 400, 'No User Found', 'Usuario no encontrado')

        next()
    } catch (error) {
        response.error(req, res, 400, 'Unauthorized', error.message)
    }
}

exports.isAdmin = async(req, res, next)=>{
    const userFound = await User.findById(req.userId)
    const rolesFound = await Role.find({_id: {$in: userFound.role}})

    for(let i=0; i<rolesFound.length; i++){
        if(rolesFound[i].name === 'admin'){
            next()
            return
        }
    }
    return response.error(req, res, 400, 'Requiere permisos de Administrador', 'Require Admin Role')
}

exports.isUser = async(req, res, next)=>{
    const userFound = await User.findById(req.userId)
    const rolesFound = await Role.find({_id: {$in: userFound.role}})

    for(let i=0; i<rolesFound.length; i++){
        if(rolesFound[i].name === 'user'){
            next()
            return
        }
    }
    return response.error(req, res, 400, 'Es necesario registrarse', 'Require Register')
    //return res.render('login', {body: 'No puedes acceder si no eres un usuario registrado'})
}

exports.setHeader = (req, res, next)=>{
    //if(!req.session.token) return res.redirect('/')
    //const token = req.session.token
    //req.headers['auth'] = token  // Los headers son objetos y se almacenan con el encabezado como clave del valor
    next()
}