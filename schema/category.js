var mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name:String,
    isDelete: Boolean,
    order: Number,
    // product_k:[{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'product'
    // }]
});
schema.virtual('product',{
    ref:'product',
    localField:'_id',   
    foreignField:'category_k'
})

schema.set('toJSON',{virtuals:true});
schema.set('toObject',{virtuals:true});

module.exports = mongoose.model('category', schema);;

