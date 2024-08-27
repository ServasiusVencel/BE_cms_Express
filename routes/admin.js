module.exports = app => {
    const admincontroller = require('../controllers/admin')
    const router = require('express').Router();

    router.post('/register', admincontroller.register)
    router.post('/login', admincontroller.login)


    app.use('/admin', router)
}