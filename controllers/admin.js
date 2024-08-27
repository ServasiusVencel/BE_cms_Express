const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const saltRounds = 10;
require('dotenv').config();

exports.register = async (req, res) => {
    try{
        const existingAdmin = await Admin.findOne();
        if(existingAdmin) {
            return res.status(400).json({message: "Admin arleady exist!"});
        }
        const plainPassword = req.body.password;
        bcrypt.hash(plainPassword, saltRounds)
            .then((hashedPassword) => {
                const newAdmin = new Admin({
                    email: req.body.email,
                    password: hashedPassword
                });
                 newAdmin.save()
                .then(() => {
                    res.status(201).json({ message: 'Admin registered successfully.' });
                })
                .catch((saveError) => {
                    res.status(500).json({ message: saveError.message });
                });
        })
            .catch((hashError) => {
            return res.status(500).json({ message: hashError.message });
        });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
}

exports.login = async (req, res) => {
    try{
        const {email,password} = req.body

        const admin = await Admin.findOne({email});

        if(!admin) {
            return res.status(404).json({message : 'Admin not found!'})
        }

        bcrypt.compare(password, admin.password)
        .then((match) =>{
            if(match){
                const token = jwt.sign({email : admin.email}, process.env.JWT_PASS, {expiresIn : '12h'})
                res.json({ status: true, code : 200, token ,message : 'login success'});
            }else{
                return res.status(401).json({message : 'invalid email or password!'});
            }
        })
        .catch((error) => {
            return res.status(500).json({message: error.message})
        });
    }catch (error){
        res.status(500).json({message : error.message});
    }
}
