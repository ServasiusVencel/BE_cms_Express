const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const About = require('../models/about'); // Gunakan 'About' dengan huruf kapital
const saltRounds = 10;
require('dotenv').config();
const path = require('path');
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'abouts/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan timestamp pada nama file untuk unik
    }
});
const upload = multer({ storage: storage });

exports.createAbout = (req, res) => {
    upload.single('image')(req, res, (err) => { // Ubah 'image' menjadi 'file'
        if (err) {
            return res.status(500).json({ message: "Error uploading file", error: err });
        }

        const newAbout = new About({
            title: req.body.title,
            desc: req.body.desc,
            image: req.file ? req.file.path : '' // Menyimpan path file gambar
        });

        newAbout.save()
            .then(result => {
                res.status(201).json({ message: "About created successfully", data: result });
            })
            .catch(err => {
                res.status(500).json({ message: "Error creating about", error: err });
            });
    });
};


exports.updateAbout = async (req, res) => {
    const updateData = {};

    if (req.body.title) {
        updateData.title = req.body.title;
    }

    if (req.body.desc) {
        updateData.desc = req.body.desc;
    }

    if (req.file) {
        try {
            // Temukan data yang ada di database
            const existingAbout = await About.findOne({}); // Misalkan Anda hanya memiliki satu entry

            if (existingAbout && existingAbout.image) {
                // Hapus file lama jika ada
                fs.unlink(existingAbout.image, (err) => {
                    if (err) {
                        console.error('Failed to delete old file:', err);
                    }
                });
            }

            // Simpan path file baru
            updateData.image = req.file.path;
        } catch (err) {
            return res.status(500).send({ status: false, code: 500, message: "Failed to update: " + err.message });
        }
    }

    try {
        const data = await About.findOneAndUpdate({}, updateData, { new: true });

        if (!data) {
            return res.status(404).send({ status: false, code: 404, message: "Data not found" });
        }

        res.send({ status: true, code: 200, message: "Data successfully updated", data });
    } catch (err) {
        res.status(500).send({ status: false, code: 500, message: err.message });
    }
};