const mongoose = require('mongoose');

require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{console.log("Database connection established")})
    .catch((err)=>{console.log("error in connecting to database")});
}

module.exports = dbConnect;