var SchemaclassRoom = require('../schema/classRoom')

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
            Search.classRoomName= new RegExp(query.key,'i');
        }
        var limit = parseInt(query.limit)||2;
        var page = parseInt(query.page)||1;
        var skip = (page-1)*limit;
        return SchemaclassRoom.find(Search).select('name teacherName ').sort(sort).skip(skip).exec();
    },
    getOne:function(id){
        return SchemaclassRoom.findById(id);
    },
    getByName:function (name){
        return SchemaclassRoom.findOne({classRoomName:name}).exec();
    },
    createclassRoom:function(classRoom){
        return new SchemaclassRoom(classRoom).save();
    },
    login:function ( classRoomName, password){
        return SchemaclassRoom.checkLogin(classRoomName,password);
    },
    delete: function (id) {
        return SchemaclassRoom.findOneAndDelete({ _id: id }).exec();
      },findByIdAndUpdate: function (id, updateData) {
        return SchemaclassRoom.findOneAndUpdate({ _id: id }, updateData, { new: true }).exec();
    },
}