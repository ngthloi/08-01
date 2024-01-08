var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelproduct = require('../models/product')
var validate = require('../validates/product')
const {validationResult} = require('express-validator');
var Schemaproduct = require('../schema/product')
const { checkLogin, checkRole,checkRoleAdmin, checkRegister } = require('../middlewares/protect');
var modelUser = require('../models/user')




router.get('/', async function (req, res, next) {
 
 
     var productsAll = await modelproduct.getall(req.query);
   
    responseData.responseReturn(res, 200, true, productsAll);
 
 

});
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

    const product = await modelproduct.getOne(objectId);
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
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
    const newproduct = await modelproduct.createproduct({
      name: req.body.name,
      order: req.body.order,
      isDelete: req.body.isDelete,
      price: req.body.price,
      category_k:req.body.category_k,
    })
    responseData.responseReturn(res, 200, true, newproduct);
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
     const product = await modelproduct.findByIdAndUpdate(objectId, req.body, { returnDocument: 'after' });
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay product");
  }
});


router.delete('/delete/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

     await modelproduct.updateOne({ _id: objectId }, { isDelete: true });

    responseData.responseReturn(res, 200, true, "Xoá thành công");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});


router.get('/search/:key', async (req, res) => {
  try {
    const searchKey = req.params.key;
    const result = await Schemaproduct.find({
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
