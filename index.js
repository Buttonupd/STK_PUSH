const express = require("express");
const app = express();
require('dotenv').config()
const port = process.env.PORT;
const mpesaRoutes = require('./routes/mpesa');
const mogoose = require('mongoose');
const sql = require("mssql")

app.use('/api', mpesaRoutes);
mogoose.connect(process.env.DB, {
    useNewUrlParser : true,
    useCreateIndex: true,
    useUnifiedTopology:true
})
.then(() =>{
    console.log("Connected successfully to the database");
})
.catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




