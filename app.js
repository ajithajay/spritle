const express = require("express"), 
    mongoose = require("mongoose"), 
    passport = require("passport"), 
    bodyParser = require("body-parser"), 
    LocalStrategy = require("passport-local"), 
    passportLocalMongoose =  
        require("passport-local-mongoose"), 
    User = require("./models/User"); 
    path = require('path'), dotenv = require('dotenv');
const { protect, authorize } = require('./middleware/auth');
const { getTrains, getTrain, createTrain, newBooking} = require('./controller/train');

// Load ENV variable
dotenv.config({ path: './config/config.env' });

// DB Connect
mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true); 
mongoose.connect(process.env.MONGO_URL); 

var app = express(); 
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(require("express-session")({ 
    secret: "ajithr", 
    resave: false, 
    saveUninitialized: false
})); 

app.use(passport.initialize()); 
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

//===================== 
// ROUTES 
//===================== 
  
// Showing home page 
app.get("/", function (req, res) { 
    res.render("home"); 
});

//Showing login form 
app.get("/login", function (req, res) { 
    res.render("login"); 
}); 

//Handling user login 
app.post("/login", passport.authenticate("local", { 
    successRedirect: "/train", 
    failureRedirect: "/login"
}), function (req, res) { 
});

//Handling user logout  
app.get("/logout", function (req, res) { 
    req.logout(); 
    res.redirect("/"); 
}); 

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    
    User.register(new User({username: req.body.username,role: req.body.role}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/login");
    })    
    })
})



app.get("/train",protect,getTrains);
app.post("/train",protect,authorize("admin"),createTrain)
app.get("/booking/:id",protect,getTrain);
app.post("/booking/:id",protect,newBooking);
  
var port = process.env.PORT || 3000; 
app.listen(port, function () { 
    console.log("Server Has Started!"); 
}); 
  

app.use('/', (req, res) => {
	res.status(404).send('<h1>404 Page Not Found!</h1>');
});
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error : ${err.message}`);
  });
