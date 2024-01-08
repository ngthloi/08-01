var mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: String,
    teacherName: String
});

schema.virtual('student',{
    ref:'student',
    localField:'_id',   
    foreignField:'class_k'
})

schema.set('toJSON',{virtuals:true});
schema.set('toObject',{virtuals:true});

module.exports = mongoose.model('classRoom', schema);