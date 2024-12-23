require("dotenv").config();
const nodemailer = require("nodemailer");

const send_email = async ({ to, subject, htmlBody }) => {
      const from = process.env.MAIL_ID;
      console.log(to, subject);

      // Input validation
      if (!from || typeof from !== "string" || !from.trim()) {
            console.error("Invalid or missing sender email in environment variables.");
            return false;
      }

      if (!Array.isArray(to) || to.some((email) => typeof email !== "string" || !email.trim())) {
            console.error("Invalid recipient email addresses.");
            return false;
      }

      if (typeof subject !== "string" || !subject.trim()) {
            console.error("Invalid email subject.");
            return false;
      }

      if (typeof htmlBody !== "string" || !htmlBody.trim()) {
            console.error("Invalid email HTML body.");
            return false;
      }

      // Configure SMTP transport data
      const transportData = {
            host: 'mail.kalbelajobs.com', // Use environment variable or default
            port: 587,
            secure: false, // Use secure connection if specified
            auth: {
                  user: process.env.MAIL_ID,
                  pass: process.env.MAIL_PASS,
            },
      };

      const transporter = nodemailer.createTransport(transportData);

      // Define email options
      const mailOptions = {
            from,
            to,
            subject,
            html: htmlBody,
      };

      try {
            console.log('hit');
            const info = await transporter.sendMail(mailOptions);
            console.log('hit2');
      } catch (error) {
            console.error('Error sending email:', error);
            console.log('hit1'); // This will log if an error occurs
      }
};

module.exports = { send_email };
