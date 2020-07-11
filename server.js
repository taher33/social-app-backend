const dotenv = require('dotenv').config({
    path: './config.env'
})
const app = require("./app")
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000;


mongoose.connect(
    `mongodb+srv://taher:${process.env.MONGO_DB_PASSWORD}@pacebook-f21hd.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }, () => {
        console.log('connected to data base')
    }
);

app.listen(PORT, () => {
    console.log("port : " + PORT);
});