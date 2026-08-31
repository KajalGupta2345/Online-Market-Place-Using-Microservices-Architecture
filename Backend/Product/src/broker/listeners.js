const { subscribeToQueue } = require('./broker');
const productModel = require('../models/product.model');

module.exports = function listeners() {
    subscribeToQueue('ORDER_PRODUCT.STOCK_DECREMENT', async (data) => {
        try {
            for (const item of data.items) {
                await productModel.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity }
                });
            }
            console.log('STOCK_DECREMENT processed for', data.items.length, 'item(s)');
        } catch (err) {
            console.log('STOCK_DECREMENT failed:', err.message);
        }
    });
};