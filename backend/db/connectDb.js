// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.Mongo_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        console.log(`MongoDb Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error : ${error.message}`);
        process.exit(1);
    }
};

export default connectDb;
// module.exports = connectDb;