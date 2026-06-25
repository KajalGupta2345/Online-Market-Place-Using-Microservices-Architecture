const orderModel = require('../models/order.models');
const { subscribeToQueue } = require('./broker');

module.exports = function () {
    subscribeToQueue('PAYMENT_ORDER.PAYMENT_COMPLETED', async (data) => {
        await orderModel.findByIdAndUpdate(
            data.orderId,
            { status: data.status }
        );
        console.log(`Order ${data.orderId} status updated to ${data.status}`);
    });
}