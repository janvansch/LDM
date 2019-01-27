var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  // productDef: [{
  //   line: {
      lineLabel: {
        type: String
      },
      lineValue: {
        type: String
      },
      lineTypes: [{
        typeLabel: {
          type: String
        },
        typeValue: {
          type: String
        }
      }]
//    }
//   }]
});
var Product = mongoose.model('Product', ProductSchema);
module.exports = {Product};