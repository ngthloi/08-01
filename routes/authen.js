var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelUser = require('../models/user')
var validate = require('../validates/user')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const configs = require('../helper/configs');
const { checkLogin, checkRole, checkRegister } = require('../middlewares/protect');

const { createServer } = require('node:http');
const { join } = require('node:path');

const app = express();
const server = createServer(app);

app.get('/chat', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});
router.post('/register', validate.validator(),
  async function (req, res, next) {

    await checkRegister(req, res, next);

  });
router.post('/login', async function (req, res, next) {
  var result = await modelUser.login(req.body.userName, req.body.password);

  if(result.err){
    responseData.responseReturn(res, 400, false, result.err);
    return;
  } 
  console.log(result);
  var token = result.getJWT();
  res.cookie('tokenJWT',token,{
    // expires:new Date(Date.now()+2*24*3600*1000),
    expires: new Date(Date.now() + 5 ),

    httpOnly:true
  });
  responseData.responseReturn(res, 200, true, token);

});

router.get('/logout', async function(req, res, next){
  res.cookie('tokenJWT','none',{
    expires:new Date(Date.now()+1000),
    httpOnly:true
  });
  responseData.responseReturn(res, 200, true, 'logout thanh cong');
});


router.get('/me', async function(req, res, next){
  var result = await checkLogin(req);
  if(result.err){
    responseData.responseReturn(res, 400, true, result.err);
    return;
  }
  console.log(result+"haha");
  req.userID = result;
  next();
},async function(req, res, next){
   await checkRole(req, res, next);
}, async function (req, res, next) { 
  var user = await modelUser.getOne(req.userID); 
  
  // res.send({ "done": user});
  responseData.responseReturn(res, 200, true, user);
});

router.post('/forgetPassword', async function(req, res, next){
  var email = req.body.email;
  var user = await modelUser.getByEmail(email);
  if(!user){
    return ;//return loi
  }
  console.log(user);
  user.addTokenForgotPassword();
  await user.save();
  try {
    sendmail.send(user.email,user.tokenForgot);
    responseData.responseReturn(res, 200, true,'gui mail thanh cong');
  } catch (error) {
    user.tokenForgot = undefined;
    user.tokenForgotExp = undefined;
    responseData.responseReturn(res, 400, true,'gui mail loi vui long thu lai'+error);
  }  
  return;
})

router.post('/resetPassword/:token', async function(req, res, next){
   var token = req.params.token;
   var password = req.body.password;
   var user = await modelUser.getByTokenForgot(token);
   user.password = password;
   user.tokenForgot = undefined;
   user.tokenForgotExp = undefined;
   await user.save();
})

module.exports = router;