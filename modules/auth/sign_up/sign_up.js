const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { user_collection, password_backup } = require("../../../collection/collections/auth");
const { response_sender } = require("../../hooks/respose_sender");
const send_email = require('../../../mail/send_email');
const generateVerificationEmail = require('../../../mail/template/vericicationmail');







const create_user = async (req, res, next) => {
      try {
            let data = req.body;
            if (!data) {
                  throw new Error('User data is required');
            }

            // Ensure password exists in the data
            const password = data.password;
            if (!password) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Password is required",
                  });
                  return;
            }
            const user_data = {
                  ...data,
                  password: password,
            }
            if (!user_data.email) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Email is required",
                  });
                  return;
            }
            const find_user = await user_collection.findOne({ email: user_data.email });
            if (find_user) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "User already exists",
                  });
                  return;
            }
            await password_backup.insertOne(user_data);
            const saltRounds = 10;
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
            console.log(user, 'user');
            const created_user = await user_collection.insertOne(user);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "User created successfully",
                  data: {
                        user_id: created_user.insertedId
                  },
            })
      } catch (error) {
            next(error);
      }

}


module.exports = { create_user }
