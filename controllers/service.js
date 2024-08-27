const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Service = require('../models/service'); 
const saltRounds = 10;
require('dotenv').config();
const path = require('path');
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'services/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

exports.createService = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "Error uploading file", error: err });
        }

        const descArray = Array.isArray(req.body.desc) ? req.body.desc : [req.body.desc];
        const subtitleArray = Array.isArray(req.body.subtitle) ? req.body.subtitle : [req.body.subtitle];

        const newService = new Service({
            title: req.body.title,
            subtitle: subtitleArray,
            desc: descArray,
            image: req.file ? req.file.path : ''
        });

        newService.save()
            .then(result => {
                res.status(201).json({ message: "Service created successfully", data: result });
            })
            .catch(err => {
                res.status(500).json({ message: "Error creating Service", error: err });
            });
    });
};

exports.updateService = async (req, res) => {
    const updateData = {};

    if (req.body.title) {
        updateData.title = req.body.title;
    }

    if (req.body.desc) {
        updateData.desc = req.body.desc;
    }

    if (req.file) {
        try {
            const existingService = await Service.findOne({});

            if (existingService && existingService.image) {
                fs.unlink(existingService.image, (err) => {
                    if (err) {
                        console.error('Failed to delete old file:', err);
                    }
                });
            }

            updateData.image = req.file.path;
        } catch (err) {
            return res.status(500).send({ status: false, code: 500, message: "Failed to update: " + err.message });
        }
    }

    try {
        const data = await Service.findOneAndUpdate({}, updateData, { new: true });

        if (!data) {
            return res.status(404).send({ status: false, code: 404, message: "Data not found" });
        }

        res.send({ status: true, code: 200, message: "Data successfully updated", data });
    } catch (err) {
        res.status(500).send({ status: false, code: 500, message: err.message });
    }
};
