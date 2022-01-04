require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn")
const Register = require("./models/register")
const bcrypt = require("bcryptjs")


const port = process.env.PORT || 3000;


const staticPath = path.join(__dirname, "../public")
 const templatesPath = path.join(__dirname, "../templates/views");
 const partialsPath = path.join(__dirname, "../templates/partials");

 app.use(express.json())
 app.use(express.urlencoded({extended:false}));

app.use(express.static(staticPath))
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath)

// console.log(path.join(__dirname, "../public"));


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/reg", (req, res) => {
    res.render("reg")
})

app.get("/login", (req, res) => {
    res.render("login")
})

// Post req
// app.post("/reg", async(req, res) => {
//   try{
//      console.log(req.body.name);
//      res.send(req.body.name) 
//   }catch(e){
//       res.status(400).send(e);
//   }
// })

app.post("/reg", async(req, res) => {
    try{
       const registerEmp = new Register({
           name: req.body.name,
           email: req.body.email,
           password: req.body.password
       }) 
       console.log(registerEmp);
       const token = await registerEmp.generateAuthToken();
       console.log("token part "+ token);

        const registered = await registerEmp.save();
        console.log("the page part" + registered );
        // console.log(registered);
        res.status(201).render("index")

    }catch(e){
        res.status(400).send(e);
    }
  })

  // login post
  app.post("/login", async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        // console.log(`${email} and Password is ${password}`);

        const userEmail = await Register.findOne({email:email});

        const token = await userEmail.generateAuthToken();
        // console.log("token part "+ token);
console.log(userEmail);
        const isMatch = await bcrypt.compare(password, userEmail.password);

        // console.log(isMatch);

        if(isMatch){
            res.status(201).render("index")
        
        }else{
            res.send("Invalid Login Details");
        }
    }catch(e){
        res.status(400).send("Invalid Login Details")
    }
  }) 

// const bcrypt = require("bcryptjs");

// const securePassword = async (password) => {
//    const passwordHash = await bcrypt.hash(password, 10);
//    console.log(passwordHash);

//    const passwordMatch = await bcrypt.compare("Shivam@2002", passwordHash );
//    console.log(passwordMatch);
// }

// $2a$10$MWUQRGmxwiVoJ8N17xQPUuWmzt4qshc7rv2Q.KQpdiCKZ9jekVAQ2

// securePassword("Shivam@2002")


const jwt =  require("jsonwebtoken")

const crateTeoken = async() => {
    const token = await jwt.sign({_id:"61d2edab276615939e2e4ebc"}, "dfghjklasdfghjklasdfghjkasdfghjklasdfg",{
        expiresIn: "5 seconds"
    })

    // console.log(token);

    const userVer = await jwt.verify(token, "dfghjklasdfghjklasdfghjkasdfghjklasdfg")
    // console.log(userVer);
}

crateTeoken();


app.listen(port, () => {
console.log(`connection running at port no. ${port}`);
})