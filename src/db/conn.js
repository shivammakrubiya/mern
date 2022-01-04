const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://localhost:27017/registration")
.then(() => {
    console.log("connection successful");
})
.catch((e) => {
console.log(e);
})

module.exports = db;