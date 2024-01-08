var SchemaUser = require('../schema/user')

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
            Search.userName= new RegExp(query.key,'i');
        }
        var limit = parseInt(query.limit)||2;
        var page = parseInt(query.page)||1;
        var skip = (page-1)*limit;
        return SchemaUser.find(Search).select('userName password email role').sort(sort).skip(skip).exec();
    },
    getOne:function(id){
        return SchemaUser.findById(id);
    },
    getByName:function (name){
        return SchemaUser.findOne({userName:name}).exec();
    },
    createUser:function(user){
        return new SchemaUser(user).save();
    },
    login:function ( userName, password){
        return SchemaUser.checkLogin(userName,password);
    },
    delete: function (id) {
        return SchemaUser.findOneAndDelete({ _id: id }).exec();
      },findByIdAndUpdate: function (id, updateData) {
        return SchemaUser.findOneAndUpdate({ _id: id }, updateData, { new: true }).exec();
    },
}