const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = schema({
  _id:mongoose.Schema.Types.ObjectId,
  name: {type:String, required:true},
  price: {type:Number,required:true}
})


module.exports = mongoose.model('product',productSchema)