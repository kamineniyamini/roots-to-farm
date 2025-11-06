const nodemailer = require('nodemailer');

// Create transporter - FIXED: createTransport not createTransporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Email templates
const emailTemplates = {
    orderConfirmation: (order, user) => ({
        subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Roots to Farm Fresh Market</h1>
            <h2>Order Confirmation</h2>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Thank you for your order! We're preparing your fresh farm products.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
            </div>
            
            <p>We'll notify you when your order ships.</p>
            <p>Thank you for supporting local farmers!</p>
          </div>
          <div class="footer">
            <p>Roots to Farm Fresh Market<br>
            Fresh produce directly from local farms</p>
          </div>
        </div>
      </body>
      </html>
    `
    })
};

// Send email function
const sendEmail = async(to, template, data) => {
    try {
        const emailContent = emailTemplates[template](...data);

        const mailOptions = {
            from: `"Roots to Farm" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: to,
            subject: emailContent.subject,
            html: emailContent.html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };