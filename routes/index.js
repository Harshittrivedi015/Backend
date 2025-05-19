import { Router } from 'express';
var router = Router();
import User from "../models/UserModel.js"


/* GET home page. */
router.get('/', function(req,res) {
  res.send("hello user")
});

 router.post("/signup",)


// function(req,res){
//   var name=req.body.name
//   var email=req.body.email
//   var password=req.body.password

//   const user = new User({
//   name:name,
//   email:email,
//   password:password
//   });

//   user.save()

//   res.json({name:name,email:email,password:password})
// })

router.get('/LoginPage',function(res,req){
  var username=req.query.username
  var password=req.query.password
  console.log(username,password)
  res.json({islogin:"successfully"})
})

export default router;
