var Schemaproduct = require('../schema/product')

module.exports ={
    getall: function (query) {
        var Search = {
          isDelete: false // Thêm điều kiện isDelete bằng false
        };
        if (query.key) {
          Search.name = new RegExp(query.key, 'i');
        }
        var limit = parseInt(query.limit) || 2;
        var page = parseInt(query.page) || 1;
        var skip = (page - 1) * limit;
      
        return Schemaproduct.find(Search)
          .select('_id name price order isDelete')
          .exec()
          .then(function (products) {
            
            products.sort(function (a, b) {
              return a.order - b.order; 
            });
      
            // Áp dụng phân trang
            var paginatedProducts = products.slice(skip, skip + limit);
      
            return {
              success: true,
              data: paginatedProducts
            };
          });
      },
    getOne:function(id){
        return Schemaproduct.find(id);
    },
    getByName:function (name){
        return Schemaproduct.findOne({}).exec();
    },
    createproduct:function(product){
        return new Schemaproduct(product).save();
    },findByIdAndUpdate: function (id, updateData) {
        return Schemaproduct.findOneAndUpdate({ _id: id }, updateData, { new: true }).exec();
    },
    delete: function (id) {
        return Schemaproduct.findOneAndDelete({ _id: id }).exec();
      },
      updateOne:function (id, updateData){
        return Schemaproduct.findOneAndUpdate({ _id: id }, updateData ).exec();
      }
}  