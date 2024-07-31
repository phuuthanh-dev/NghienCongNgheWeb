const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected successfully to database!")
    } catch (error) {
        console.log("Error connecting to database")
    }
}