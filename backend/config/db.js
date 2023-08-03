const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        console.log('hello');
        const conn = await mongoose.connect(process.env.MONGO_URI,{

            useNewUrlParser : true,
            useUnifiedTopology : true,
        });
        console.log(`MongoDB conneted ${conn.connection.host}`.green.bold);

    } catch (error) {
        console.log(`Error:${error.message}`);
        process.exit();
    }
}
module.exports = connectDB;