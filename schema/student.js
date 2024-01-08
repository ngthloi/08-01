var mongoose = require("mongoose");
 
const schema = new mongoose.Schema({
     
    name: String,
    age: Number,
    address:String,
    class_k:{
        type:mongoose.Schema.ObjectId,
        ref:'classRoom'
    }
});
 

schema.virtual('classRoom', {
    ref: 'classRoom',
    localField: 'class_k',
    foreignField: '_id',
    justOne: true
  });

module.exports = mongoose.model('student', schema);;