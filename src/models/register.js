const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const eSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

//generating tokens
eSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token })
    console.log(token);
    await this.save();
    return token;
  } catch (e) {
    res.send(e)
  }
}

// converting password into hash

eSchema.pre("save", async function (next) {

  if (!this.isModified("password")) {
    next();

  }
  this.password = await bcrypt.hash(this.password, 10);
  console.log(this.password);
})

// We need to  const securePassword = async (password) => {
//    const passwordHash = await bcrypt.hash(password, 10);collection

const Register = new mongoose.model("Register", eSchema);
module.exports = Register;