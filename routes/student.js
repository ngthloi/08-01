var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelstudent = require('../models/student')
var validate = require('../validates/student')
const {validationResult} = require('express-validator');
var Schemastudent = require('../schema/student')
const { checkLogin, checkRole,checkRoleAdmin, checkRegister } = require('../middlewares/protect');
var modelstudent = require('../models/student')




router.get('/', async function (req, res, next) {
    try {
        var studentAll = await modelstudent.getall(req.query);
         
        responseData.responseReturn(res, 200, true, studentAll);
     
      } catch (error) {
        responseData.responseReturn(res, 500, false, "Lỗi khi lấy dữ liệu");
      }

});
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

    const student = await modelstudent.getOne(objectId);
    responseData.responseReturn(res, 200, true, student);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});
router.post('/add',validate.validator(), 


  async function (req, res, next) {
    var result = await checkLogin(req);
    if(result.err){
      responseData.responseReturn(res, 400, true, result.err);
      return;
    }
     req.userID = result;
    next();
  },async function(req, res, next){
     await checkRoleAdmin(req, res, next); 
       
  },async function(req, res, next){

    var errors = validationResult(req);
    if(!errors.isEmpty()){
      responseData.responseReturn(res, 400, false, errors.array().map(error=>error.msg));
      return;
    }
 
  else {
    const newstudent = await modelstudent.createstudent({
      name: req.body.name,
      address: req.body.address,
      age: req.body.age,
      class_k:req.body.class_k
    })
    responseData.responseReturn(res, 200, true, newstudent);
  }
});
router.put('/edit/:id',validate.validator(), async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseData.responseReturn(res, 400, false, errors.array().map(error => error.msg));
      return;
    }

    const id = req.params.id;
    const objectId = new ObjectId(id);

    const student = await modelstudent.findByIdAndUpdate(objectId, req.body, { returnDocument: 'after' });
    responseData.responseReturn(res, 200, true, student);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay student");
  }
});


router.delete('/delete/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

    await modelstudent.delete(objectId);
     responseData.responseReturn(res, 200, true, "Xoá thành công");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});



router.get('/search/:class_k/:keyword', async (req, res) => {
  try {
    const class_k = req.params.class_k;
    const keyword = req.params.keyword;
    const result = await Schemastudent.find({
      class_k: class_k,
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } }
      ]
    }).populate('class_k').select('name address age'); 

    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
