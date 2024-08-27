const mongoose = require('mongoose')

const aboutSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    image:{
        type:String,
        required: true,
    }
})

module.exports = mongoose.model('about', aboutSchema)