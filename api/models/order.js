const mongoose = require('mongoose');
const schema = mongoose.Schema;

//mongodb is not a sequel database that means non-relational
//so we shall build relations between products and orders
const orderSchema = schema({
  _id:mongoose.Schema.Types.ObjectId,
  product:{type:mongoose.Schema.Types.ObjectId, ref:'Product',required:true},
  quantity:{type:Number, default:1},
  productName:{type:String,reduired:true}

})


module.exports = mongoose.model('Order',orderSchema)