const express = require('express');
const app = express();
const dbConnect = require("./config/database");
require('dotenv').config();
const PORT = process.env.PORT || 8000;
app.use(express.json());
 
dbConnect();
app.listen(PORT,()=>{
    console.log(`App is listening on ${PORT}`);
});
