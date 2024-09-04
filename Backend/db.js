const mongoose = require("mongoose");
const port = process.env.DB_PORT
const dbName = process.env.DB_NAME

module.exports.connect = async() => {
    console.log(`mongodb://localhost:${port}/${dbName}`);
    
    await mongoose.connect(`mongodb://localhost:${port}/${dbName}`).then(connected =>{
        console.log("database connected on port", port);
    }).catch(err =>{
        console.log(err);
    })
}