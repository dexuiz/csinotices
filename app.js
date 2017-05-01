var express   =require("express"),
    mongoose  =require("mongoose"),
    bodyParser=require("body-parser"),
    app       =express();

var admin={
  aname:"admin",
  apass:"admin"
};

var logged=false;

var methodOverride  = require("method-override");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
// mongoose.connect("mongodb://localhost/csinotice");
mongoose.connect("mongodb://<dexuiz>:<deval1997>@ds127531.mlab.com:27531/csinotice");
var noticeSchema = new mongoose.Schema({
  name:String,
  body:String,
  date:{type:Date,default:Date.Now}
});

var notice = mongoose.model("notice",noticeSchema);
var port = process.env.PORT||3000;

// notice.create({
//   name:"third notice",
//   body:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt Lorem mollit anim id est laborum."
// },function(err,notice){
//   if (err) {
//     console.log("addition problem");
//   }else {
//     console.log("notice added",notice);
//   }
// });
//
// notice.create({
//   name:"fourth notice",
//   body:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt Lorem mollit anim id est laborum."
// },function(err,notice){
//   if (err) {
//     console.log("addition problem");
//   }else {
//     console.log("notice added",notice);
//   }
// });

app.get("/",function(req,res){
  notice.find({},function(err,notice){
    if (err) {
      console.log("error in adding notice");
    }else {
      console.log("notices found", notice);
      res.render("index",{notice:notice});
    }
  });
});

app.get("/admin",isLogged,function(req,res){
  notice.find({},function(err,notice){
    if (err) {
      console.log("there was a error");
    }else {
      console.log("notices found for admin",notice);
      res.render("admin",{notice:notice});
    }
  });
});

app.get("/admin/login",function(req,res){
  res.render("alogin");
});

app.post("/admin/login",function(req,res){
  console.log("post for auth");
  if(JSON.stringify(req.body.admin) == JSON.stringify(admin)){
    logged=true;
    console.log("password accepted");
    res.redirect("/admin");
  }else {
    res.send("wrong admin login . Please contact the admin");
  }
});

app.get("/admin/new",isLogged,function(req,res){
  res.render("new");
});

app.post("/admin/new",isLogged,function(req,res){
  notice.create(req.body.notice,function(err,data){
    if (err) {
      console.log("there was a error in adding a notice",err);
    }else {
      console.log("data added",data);
      res.redirect("/admin");
    }
  });
});

app.get("/admin/:id/edit",isLogged,function(req,res){
  notice.findById(req.params.id,function(err,notice){
    if (err) {
      console.log("ther was error while looking up",err);
    }else {
      console.log("data for edit",notice);
      res.render("edit",{notice:notice});
    }
  });
});

app.put("/admin/:id/edit",isLogged,function(req,res){
  notice.findByIdAndUpdate(req.params.id,req.body.notice,function(err,notice){
    if (err) {
      console.log("there was a error while updating",err);
    }else {
      console.log("notice updated");
      res.redirect("/admin");
    }
  });
});


app.get("/admin/:id/delete",isLogged,function(req,res){
  notice.findByIdAndRemove(req.params.id,function(err){
    if (err) {
      console.log("there was a error ");
    }else {
      res.redirect("/admin");
    }
  });
});


app.get("/search",function(req,res){
var string=req.query.q;
var regex =/string/ig;

  notice.find({$or:[{name:new RegExp(string,"i")},{body:new RegExp(string,"i")}]},function(err,data){
    if (err) {
      console.log("erorr in search");
    }else {
      res.render("index",{notice:data});
    }
  });
});

app.get("/admin/search",function(req,res){
  var string=req.query.q;
  var regex =/string/ig;

    notice.find({$or:[{name:new RegExp(string,"i")},{body:new RegExp(string,"i")}]},function(err,data){
      if (err) {
        console.log("erorr in search");
      }else {
        res.render("admin",{notice:data});
      }
    });
});



 function isLogged(req,res,next){
  if (logged===true) {
    return next();
  }else {
    console.log("you need to login first");
    res.redirect("/admin/login");
  }
}


app.listen(port,function(){
  console.log("listening on port number 3000");
});
