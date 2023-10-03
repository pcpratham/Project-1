const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dbConnect = require("./config/database");
require('dotenv').config();


const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cookieParser());


const authRoutes = require("./routes/Auth");
const blogRoutes = require("./routes/Blog");
app.use("/auth",authRoutes); 
app.use("/blog",blogRoutes); 



dbConnect();


app.listen(PORT,()=>{
    console.log(`App is listening on ${PORT}`);
});
