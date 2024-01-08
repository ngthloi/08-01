var SchemaCategory = require('../schema/category')

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
            Search.name= new RegExp(query.key,'i');
        }
        var limit = parseInt(query.limit)||2;
        var page = parseInt(query.page)||1;
        var skip = (page-1)*limit;
        return SchemaCategory.find(Search).select('name order price isDelete product_k').sort(sort).skip(skip).exec();
    },
    getOne:function(id){
        return SchemaCategory.findById(id);
    },
    getByName:function (name){
        return SchemaCategory.findOne({userName:name}).exec();
    },
    createcategory:function(user){
        return new SchemaCategory(user).save();
    },
    login:function ( userName, password){
        return SchemaCategory.checkLogin(userName,password);
    },
    delete: function (id) {
        return SchemaCategory.findOneAndDelete({ _id: id }).exec();
      },findByIdAndUpdate: function (id, updateData) {
        return SchemaCategory.findOneAndUpdate({ _id: id }, updateData, { new: true }).exec();
    },
}