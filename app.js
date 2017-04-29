var express   =require("express"),
    mongoose  =require("mongoose"),
    bodyParser=require("body-parser"),
    app       =express();

var methodOverride  = require("method-override");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

var noticeSchema = new mongoose.Schema({
  name:String,
  body:String,
  date:{type:Date,default:Date.Now}
});

var notice = mongoose.model("notice",noticeSchema);
var port = process.env.PORT||3000;

app.get("/",function(req,res){
  res.render("index");
});

app.get("/admin",function(req,res){
  res.render("admin");
});

app.get("/admin/login",function(req,res){
  res.render("alogin");
});

app.get("/admin/new",function(req,res){
  res.render("new");
});

app.post("/admin/new",function(req,res){
  notice.create(req.params.notice,function(err,data){
    if (err) {
      console.log("there was a error in adding a notice",err);
    }else {
      console.log("data added",data);
      res.redirect("/admin");
    }
  });
});

app.get("/admin/:id/edit",function(req,res){
  notice.findById(req.params.id,function(err,notice){
    if (err) {
      console.log("ther was error while looking up",err);
    }else {
      res.render("edit",{notice:notice});
    }
  });
  res.render("edit");
});

app.put("/admin/:id/edit",function(req,res){
  notice.findByIdAndUpdate(req.params.id,req.body.notice,function(err,notice){
    if (err) {
      console.log("there was a error while updating",err);
    }else {
      console.log("notice updated");
      res.redirect("/admin");
    }
  });
});


app.delete("/admin/:id/delete",function(req,res){
  notice.findByIdAndRemove(req.params.id,function(err){
    if (err) {
      console.log("there was a error ");
    }else {
      res.redirect("/admin");
    }
  });
});


app.get("/search",function(req,res){
var string=req.query.s;
var regex =/string/ig;

  notice.find({$or:[{name:string},{body:string}]},function(err,data){
    if (err) {
      console.log("erorr in search");
    }else {
      res.render("/",{notice:data});      
    }
  });
});

app.listen(port,function(){
  console.log("listening on port number 3000");
});
