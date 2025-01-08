require("dotenv").config();
const nodemailer = require("nodemailer");

const send_email = async ({ to, subject, htmlBody }) => {
      const from = process.env.MAIL_ID;

      // Input validation
      if (!from || typeof from !== "string" || !from.trim()) {
            return false;
      }

      if (!Array.isArray(to) || to.some((email) => typeof email !== "string" || !email.trim())) {
            return false;
      }

      if (typeof subject !== "string" || !subject.trim()) {
            return false;
      }

      if (typeof htmlBody !== "string" || !htmlBody.trim()) {
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
            const info = await transporter.sendMail(mailOptions);
      } catch (error) {
            console.error('Error sending email:', error);
      }
};

module.exports = { send_email };
