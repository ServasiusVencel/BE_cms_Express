module.exports = app => {
    const aboutController = require('../controllers/about');
    const router = require('express').Router();
    const authenticateJWT = require('../middleware/index');
    const multer = require('multer');
    const path = require('path');

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'abouts/');
        },
        filename: function (req, file, cb) {
            // Menambahkan timestamp dan nama asli file
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });

    router.post('/addabout', authenticateJWT, aboutController.createAbout);
    router.put('/update', authenticateJWT, upload.single('image'), aboutController.updateAbout);

    app.use('/about', router);
};
