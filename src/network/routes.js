const express = require('express')
const user = require('../components/user/network')
const producto = require('../components/productos/network')
const venta = require('../components/ventas/network')
const auth = require('../components/auth/network')

// Creamos un servidor de rutas
const routes = function (server) {
    server.use('/user', user)
    server.use('/producto', producto)
    server.use('/venta', venta)
    server.use('/auth', auth)
}

module.exports = routes