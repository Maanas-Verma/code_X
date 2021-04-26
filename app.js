var express=require("express");
var app=express();
var bodyparser = require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var localStrategy=require("passport-local");
var localStrategy1=require("passport-local");
var hotel=require("./models/hotel.js");
var ngo=require("./models/ngo.js");

mongoose.connect("mongodb://localhost/test",{useNewUrlParser:true});

var cityschema=new mongoose.Schema({
    name:String,
    image:String,
    status:Boolean,
});
app.use(require("express-session")({
    secret:"wasting food is a bad thing",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport.use(new localStrategy(hotel.authenticate()));
// passport.serializeUser(hotel.serializeUser());
// passport.deserializeUser(hotel.deserializeUser());
// passport.use(new localStrategy(ngo.authenticate()));
// passport.serializeUser(ngo.serializeUser());
// passport.deserializeUser(ngo.deserializeUser());

var database=mongoose.model("database",cityschema);

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.render("landing");

});
//post accept=============================================
app.post("/accept",function(req,res){
     console.log("yay");
     database.findOneAndUpdate({"name":"divine"},{ $set: { "status":false }},function(err,doc){
        if(err){
            console.log("something went wrong");
        }else{
            console.log("###succesful");
            res.redirect("/city");
        }
    });
    
});

//HOTEL REGISTER ============================================
app.get("/hotelRegister",function(req,res){
    res.render("hotelRegister")
})
app.post("/hotelRegister",function(req,res){
    // app.use(passport.initialize());
    // app.use(passport.session());

    passport.use(new localStrategy(hotel.authenticate()));
    passport.serializeUser(hotel.serializeUser());
    passport.deserializeUser(hotel.deserializeUser());
    hotel.register(new hotel({
        username:req.body.username,
        hotelname:req.body.hotelname,
        streetaddress:req.body.streetaddress,
        city:req.body.city,
        postalcode:req.body.postalcode, 
        state:req.body.state,
        number:req.body.no
    }),req.body.password, function(err,hotel){
        if(err){
            console.log(err);
            return res.render("hotelRegister");

        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/city");
            });
            
        }
    })
})
//NGO REGISTER ============================================
app.get("/ngoRegister",function(req,res){
    res.render("ngoRegister");
})
app.post("/ngoRegister",function(req,res){
    passport.use(new localStrategy1(ngo.authenticate()));
    passport.serializeUser(ngo.serializeUser());
    passport.deserializeUser(ngo.deserializeUser());
    ngo.register(new ngo({
        // username:req.body.username,
        username:req.body.username,
        streetaddress:req.body.streetaddress,
        city:req.body.city,
        postalcode:req.body.postalcode,
        state:req.body.state,
        email:req.body.email,
        mobile_no:req.body.mobile_no,
        url:req.body.url
    }),req.body.password, function(err,ngo){
        if(err){
            console.log(err);
            return res.render("ngoRegister");

        }else{
            
            passport.authenticate("local")(req,res,function(){
                res.redirect("/city");
            });
            
        }
    })
})

// LOGIN SYSTEM ===================================
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",passport.authenticate("local",{
    successRedirect:"/city",
    failureRedirect:"/login"
}),function(req,res){
    // res.redirect("/city");
})
// LOGOUT ========================================
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/city");
})

app.get("/city",function(req,res){
    database.find({},function(err,alldata){
    if(err){
        console.log("something went wrong");
    }else{
        res.render("cityr",{city:alldata,isLoggedIn:isLoggedIn});
    }
    });
});

app.post("/city",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var accept=true;
    var newcity={name:name,image:image,status:accept}
    database.create(newcity,function(err,complete){
        if(err){
            console.log("something went wrong");
        }else{
            console.log("new city is added");
            console.log(complete);
        }
    });
    res.redirect('/city');
});
// ADDING FOOD POST ======================================
app.get('/hotel/new',isLoggedIn,function(req,res){
    res.render("new.ejs")
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(localhost=3000,function(){
    console.log('server is running ...');
})