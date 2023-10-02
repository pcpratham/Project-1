const express = require('express');
const app = express();
const dbConnect = require("./config/database");
require('dotenv').config();
const PORT = process.env.PORT || 8000;
app.use(express.json());

const authRoutes = require("./routes/Auth");
app.use("/auth",authRoutes); 


dbConnect();
app.listen(PORT,()=>{
    console.log(`App is listening on ${PORT}`);
});
