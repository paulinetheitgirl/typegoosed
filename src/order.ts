const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema({
    amount: Number
  });
  
  const Order = mongoose.model('Order', orderSchema);
  export default Order;