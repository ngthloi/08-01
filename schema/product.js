var mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name:String,
    isDelete: Boolean,
    price: Number,
    order: Number,
    category_k:[{
        type:mongoose.Schema.ObjectId,
        ref:'category'
    }]
});
schema.virtual('category', {
    ref: 'category',
    localField: 'category_k',
    foreignField: '_id',
   });
module.exports = mongoose.model('product', schema);;

