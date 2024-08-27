const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    }, 
    subtitle: {
        type: [String], 
        required: true,
    },
    desc:{
        type: [String],
        required: true,
    },
    image:{
        type:String,
        required: true,
    }
})

module.exports = mongoose.model('service', serviceSchema)