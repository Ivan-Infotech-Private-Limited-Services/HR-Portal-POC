const mongoose = require("mongoose");

module.exports.connect = async() => {
    console.log(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    
    await mongoose.connect(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`).then(connected =>{
        console.log("database connected on port", process.env.DB_PORT);
    }).catch(e =>{
        console.log(e);
    })
}