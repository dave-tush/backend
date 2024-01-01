const express = require("express")
const mongoose = require("mongoose")
// const json = require("json")
const app = express()
require('dotenv').config();


//middleware for JSON parsing
app.use(express.json())

mongoose.connect("mongodb+srv://mustaphadavid98:david@cluster0.ef8zrsi.mongodb.net/?retryWrites=true&w=majority");
const connections = mongoose.connection;
connections.once('open', ()=> {
    console.log("connection successfull")


})
// const mongo = require("mongodb").mongo
const bodyParser = require("body-parser");

port = 5000 || process.env.port
const userRoutes = require("./routes/user");

app.use(bodyParser.json())
app.use("/user", userRoutes);


const connection = mongoose.connection
connection.once("open", () => {
    console.log("MongoDB connected successfully")
})
app.listen(port, () => {
    console.log(`app running at ${port}`)
})