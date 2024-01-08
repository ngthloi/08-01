var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelCategory = require('../models/category')
 const {validationResult} = require('express-validator');
var SchemaCategory = require('../schema/category')
const { checkLogin, checkRole,checkRoleAdmin, checkRegister } = require('../middlewares/protect');
var modelCategory = require('../models/category')



 

router.get('/', async function (req, res, next) {
 
     
      //  var productsAll = await modelCategory.getall(req.query);
       
      // responseData.responseReturn(res, 200, true, productsAll);
      var categoryAll = await SchemaCategory.find({})
      .populate({path:'product',select:'_id name order isDelete '});
      responseData.responseReturn(res, 200, true, categoryAll);

  
  });
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/:id', async function (req, res, next) {
  try {
     

    const category = await modelCategory.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, category);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy class");
  }
});

router.get('/detailClass/:id', async function (req, res, next) {
  try {
     

    const category = await modelCategory.getOne(req.params.id).populate({path:'student',select:'_id name age address'});
    // responseData.responseReturn(res, 200, true, categoryAll);;


    responseData.responseReturn(res, 200, true, category);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy class");
  }
});

router.post('/add', 

  async function (req, res, next) {
   
    var errors = validationResult(req);
    if(!errors.isEmpty()){
      responseData.responseReturn(res, 400, false, errors.array().map(error=>error.msg));
      return;
    }
 
  else {
    const newcategory = await modelCategory.createcategory({
      name: req.body.name,
      price: req.body.price,
      isDelete: req.body.isDelete,
      order: req.body.order,
        // product_k:req.body.product_k
    })
    responseData.responseReturn(res, 200, true, newcategory);
  }
});
router.put('/edit/:id', async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseData.responseReturn(res, 400, false, errors.array().map(error => error.msg));
      return;
    }

    const id = req.params.id;
    const objectId = new ObjectId(id);
    
    const category = await modelCategory.findByIdAndUpdate(objectId, req.body, { returnDocument: 'after' });
    responseData.responseReturn(res, 200, true, category);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay category");
  }
});


router.delete('/delete/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

    await modelCategory.delete(objectId);
     responseData.responseReturn(res, 200, true, "Xoá thành công");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});



router.get('/search/:key', async (req, res) => {
  try {
    const searchKey = req.params.key;
    const result = await SchemaCategory.find({
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
