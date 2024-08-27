module.exports = app => {
    const serviceController = require('../controllers/service');
    const router = require('express').Router();
    const authenticateJWT = require('../middleware/index');
    const multer = require('multer');
    const path = require('path');

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'services/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });

    
    router.post('/addservice', authenticateJWT, serviceController.createService);
    router.put('/update', authenticateJWT, upload.single('image'), serviceController.updateService);

    app.use('/service', router);
};
