const { subscribeToQueue } = require('./broker');
const {sendmail}= require('../email');

module.exports = function () {
    subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', async (data) => {
        const emailHtmlTemplate =
            `<h1>Welcome to our service</h1>
            <p>Dear ${data.fullname.firstname + " " + data.fullname.lastname + " "},</p>
             <p>
                Thank you for registering with <strong>Our Platform</strong>.
                We’re excited to have you on board!
              </p>
              <p>
                Your account has been successfully created using this email.  
              </p>
               <p>
                You can now log in and start exploring our features.
              </p>

              <p>
                If you have any questions or face any issues, feel free to reach out to our support team.
              </p>

              <p>
                Happy learning & building 🚀
              </p>

              <p style="margin-top: 30px;">
                Regards,<br>
                <strong>Team Our Platform</strong>
              </p>

        `
        await sendmail(data.email,'Welcome to Our Platform',' ',emailHtmlTemplate);
    });
    subscribeToQueue('PRODUCT_NOTIFICATION.PRODUCT.CREATED',async(data)=>{
      const emailHtmlTemplate = `
        <h2>Product Created Successfully 📦</h2>
        <p>Hi ${data.username},</p>
        <p>Your product has been created successfully. Here are the details:</p>

        <div>
          <p><strong>Product ID:</strong> ${data.productId}</p>
          <p><strong>Seller ID:</strong> ${data.sellerId}</p>
        </div>

        <p>You can now manage this product from your dashboard.</p>
        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
      `;

      await sendmail(
        data.email,
        'New product Created Successfully 📦',
        ' ',
        emailHtmlTemplate
      );
    })
    subscribeToQueue('PAYMENT_NOTIFICATION.PAYMENT_INITIATED',async(data)=>{
     const emailHtmlTemplate = `
        <h2>Payment Initiated 🕒</h2>
        <p>Hi ${data.username},</p>
        <p>Your payment has been initiated successfully. Here are the details:</p>

        <div>
          <p><strong>Order ID:</strong> ${data.order}</p>
          <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
          <p><strong>Status:</strong> Pending</p>
        </div>

        <p>Please complete the payment to proceed further.</p>
        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
      `;
       await sendmail(
        data.email,
        'Payment Initiated 🕒',
        ' ',
        emailHtmlTemplate
      );
    });

    subscribeToQueue('PAYMENT_NOTIFICATION.PAYMENT_COMPLETED',async(data)=>{
        const emailHtmlTemplate = `
    <h2 >Payment Successful ✅</h2>
    <p>Hi ${data.username},</p>
    <p>Your payment has been successfully processed. Here are the details:</p>
    <div>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Payment ID:</strong> ${data.paymentId}</p>
      <p><strong>Amount:</strong> ${data.price.amount} ${data.price.currency}</p>
    </div>
    <p>Thank you for your purchase!</p>
      &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
     `
     await sendmail(data.email, 'Payment Successful ✅', ' ', emailHtmlTemplate);
    });
    subscribeToQueue('PAYMENT_NOTIFICATION.PAYMENT_FAILED',async(data)=>{
        const emailHtmlTemplate = `<h2>Payment Failed ❌</h2>
        <p>Hi ${data.username},</p>
        <p>Unfortunately, your payment could not be processed. Please try again.</p>
        <div>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Payment ID:</strong> ${data.paymentId}</p>
        </div>
        <p>If the problem persists, contact our support team.</p>
        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.`
    await sendmail(data.email, 'Payment Failed ❌', ' ', emailHtmlTemplate);
    });

}