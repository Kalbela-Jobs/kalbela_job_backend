const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { user_collection, password_backup } = require("../../../collection/collections/auth");
const { response_sender } = require("../../hooks/respose_sender");
const send_email = require('../../../mail/send_email');
const generateVerificationEmail = require('../../../mail/template/vericicationmail');







const create_user = async (data) => {
      if (!data) {
            throw new Error('User data is required');
      }

      // Ensure password exists in the data
      const password = data.password;
      if (!password) {
            throw new Error('Password is required');
      }

      const user_data = {
            ...data,
            password: password,
      }

      await password_backup.insertOne(user_data);

      const saltRounds = 10; // You can adjust the salt rounds for security vs. performance
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = {
            ...data,
            password: hashedPassword, // Store the hashed password instead of the plain one
            address: '',
            gender: '',
            role: "workspace_admin",
            date_of_birth: '',
            preferences: {
                  job_alerts: true,
                  news_letter: true,
            },
            company_id: '',
            company_status: false,
            social_links: {},
            is_active: false,
            email_verify: false,
            payment_id: '',
            created_at: new Date(),
            updated_at: new Date(),
      };

      const created_user = await user_collection.insertOne(user);
      return created_user;
};



module.exports = { create_user }
