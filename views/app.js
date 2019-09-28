var express=require("express");
var app=express();
var bodyparser = require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/test",{useNewUrlParser:true});

var cityschema=new mongoose.Schema({
    name:String,
    image:String
});

var database=mongoose.model("database",cityschema);

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.render("landing");

});


app.get("/city",function(req,res){
    database.find({},function(err,alldata){
    if(err){
        console.log("something went wrong");
    }else{
        res.render("cityr",{city:alldata});
    }
    });
});

app.post("/citys",function(req,res){
    var s=req.body.see.toLowerCase();
    database.find({"name":s},function(err,alldata){
        if(err){
            console.log("something went wrong");
        }else{
            res.render("cityr",{city:alldata});
        }
    });

});
app.post("/city",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var newcity={name:name,image:image}
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

app.get('/city/new',function(req,res){
    res.render("new.ejs")
});


app.listen(localhost=3000,function(){
    console.log('server has started');
})