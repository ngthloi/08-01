var Schemastudent = require('../schema/student')

module.exports ={
    getall:function(query){
        var sort={};
        var Search={};
        if(query.sort){
            if(query.sort[0]=='-'){
                sort[query.sort.substring(1)]='desc';
            }else{
                sort[query.sort]='asc';
            }
        }
        if(query.key){
            Search.studentName= new RegExp(query.key,'i');
        }
        var limit = parseInt(query.limit)||2;
        var page = parseInt(query.page)||1;
        var skip = (page-1)*limit;
        return Schemastudent.find(Search).select('name age address class_k').sort(sort).skip(skip).exec();
    },
    getOne:function(id){
        return Schemastudent.findById(id);
    },
    getByName:function (name){
        return Schemastudent.findOne({studentName:name}).exec();
    },
    createstudent:function(student){
        return new Schemastudent(student).save();
    },
    login:function ( studentName, password){
        return Schemastudent.checkLogin(studentName,password);
    },
    delete: function (id) {
        return Schemastudent.findOneAndDelete({ _id: id }).exec();
      },findByIdAndUpdate: function (id, updateData) {
        return Schemastudent.findOneAndUpdate({ _id: id }, updateData, { new: true }).exec();
    },
}