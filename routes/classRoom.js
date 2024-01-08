var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelclassRoom = require('../models/classRoom')
var validate = require('../validates/classRoom')
const {validationResult} = require('express-validator');
var SchemaclassRoom = require('../schema/classRoom')
const { checkLogin, checkRole,checkRoleAdmin, checkRegister } = require('../middlewares/protect');
var modelclassRoom = require('../models/classRoom')



 

router.get('/', async function (req, res, next) {
 
    var result = await checkLogin(req);
    if(result.err){
      responseData.responseReturn(res, 400, true, result.err);
      return;
    }
    console.log(result+"haha");
    req.userID = result;
    next();
  },async function(req, res, next){
     await checkRoleAdmin(req, res, next); 
      
  }, async function (req, res, next) { 
    try {
      //  var productsAll = await modelclassRoom.getall(req.query);
       
      // responseData.responseReturn(res, 200, true, productsAll);
      var classRoomAll = await SchemaclassRoom.find({})
      .populate({path:'student',select:'_id name'});
      responseData.responseReturn(res, 200, true, classRoomAll);
   
    } catch (error) {
      responseData.responseReturn(res, 500, false, "Lỗi khi lấy dữ liệu");
    }
  
  });
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/:id', async function (req, res, next) {
  try {
     

    const classRoom = await modelclassRoom.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, classRoom);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy class");
  }
});

router.get('/detailClass/:id', async function (req, res, next) {
  try {
     

    const classRoom = await modelclassRoom.getOne(req.params.id).populate({path:'student',select:'_id name age address'});
    // responseData.responseReturn(res, 200, true, classRoomAll);;


    responseData.responseReturn(res, 200, true, classRoom);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy class");
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
    const newclassRoom = await modelclassRoom.createclassRoom({
      name: req.body.name,
      teacherName: req.body.teacherName,
      
 
    })
    responseData.responseReturn(res, 200, true, newclassRoom);
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

    const classRoom = await modelclassRoom.findByIdAndUpdate(objectId, req.body, { returnDocument: 'after' });
    responseData.responseReturn(res, 200, true, classRoom);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay classRoom");
  }
});


router.delete('/delete/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

    await modelclassRoom.delete(objectId);
     responseData.responseReturn(res, 200, true, "Xoá thành công");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});



router.get('/search/:key', async (req, res) => {
  try {
    const searchKey = req.params.key;
    const result = await SchemaclassRoom.find({
      $or: [
        { name: { $regex: searchKey, $options: 'i' } },
        { description: { $regex: searchKey, $options: 'i' } }
      ]
    });
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;
