const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { user_collection, password_backup } = require("../../../collection/collections/auth");
const { response_sender } = require("../../hooks/respose_sender");
const generateVerificationEmail = require('../../../mail/template/vericicationmail');
const { send_email } = require('../../../mail/send_email');
const { workspace_collection } = require('../../../collection/collections/system');
const { ObjectId } = require('mongodb');


const otpStore = {};





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

            if (password.length < 6) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Password must be at least 6 characters long",
                  });
            }

            if (!data.email) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Email is required",
                  });
                  return;
            }

            // Check if the email already exists in the in-memory store
            if (otpStore[data.email]) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "User already exists or OTP already sent. Please verify your email.",
                  });
                  return;
            }

            const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
            const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
            otpStore[data.email] = { otp, expiry: otpExpiry }; // Store OTP and expiry in memory


            const user_data = {
                  email: data.email,
                  password: password,
            }
            // Hash the password
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

            const created_user = await user_collection.insertOne(user);


            const new_data = {
                  _id: created_user.insertedId.toString(),
                  ...user,
            }
            delete new_data.password

            // Send email with OTP
            send_email({
                  email: [data.email],
                  subject: "Email Verification",
                  html: generateVerificationEmail({
                        email: data.email,
                        verification_code: otp, // Include OTP in the email template
                  }),
            });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "OTP sent to your email. Please verify.",
                  data: new_data,
            });
      } catch (error) {
            next(error);
      }
};

// Verification endpoint
const verify_email = async (req, res, next) => {
      try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Email and OTP are required",
                  });
                  return;
            }

            const otpData = otpStore[email];
            if (!otpData) {
                  response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "OTP not found or expired. Please request a new one.",
                  });
                  return;
            }

            if (otpData.expiry < Date.now()) {
                  delete otpStore[email]; // Remove expired OTP
                  await user_collection.updateOne({ email }, { $set: { email_verify: true } });
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "OTP has expired. Please request a new one.",
                  });
                  return;
            }

            if (parseInt(otp, 10) !== otpData.otp) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Invalid OTP",
                  });
                  return;
            }

            // Email verified
            delete otpStore[email]; // Remove OTP after successful verification

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Email verified successfully",
            });
      } catch (error) {
            next(error);
      }
};


const regenerate_otp = async (req, res, next) => {
      try {
            const { email } = req.body;

            if (!email) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Email is required",
                  });
                  return;
            }

            const otpData = otpStore[email];

            const newOtp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
            const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
            otpStore[email] = { otp: newOtp, expiry: otpExpiry }; // Update OTP in memory

            // Send email with new OTP
            send_email({
                  to: [email],
                  subject: "New Email Verification Code",
                  htmlBody: generateVerificationEmail({
                        email: email,
                        verification_code: newOtp, // Include the new OTP in the email template
                  }),
            });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "New OTP sent to your email. Please verify.",
            });
      } catch (error) {
            next(error);
      }
};


const create_new_hr_and_user = async (req, res, next) => {
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

            if (password.length < 6) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Password must be at least 6 characters long",
                  });
            }

            if (!data.email) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Email is required",
                  });
                  return;
            }

            // Check if the email already exists in the in-memory store
            if (otpStore[data.email]) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "User already exists or OTP already sent. Please verify your email.",
                  });
                  return;
            }

            const find_work_space = await workspace_collection.findOne({ _id: new ObjectId(data.company_id) });
            if (!find_work_space) {

                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Invalid company website",
                  });
                  return;
            }



            // Generate OTP
            // const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
            const otp = 123456
            const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
            otpStore[data.email] = { otp, expiry: otpExpiry }; // Store OTP and expiry in memory


            const user_data = {
                  email: data.email,
                  password: password,
            }
            // Hash the password
            await password_backup.insertOne(user_data);
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = {
                  ...data,
                  password: hashedPassword, // Store the hashed password instead of the plain one
                  address: '',
                  gender: '',
                  date_of_birth: '',
                  preferences: {
                        job_alerts: true,
                        news_letter: true,
                  },
                  company_status: true,
                  social_links: {},
                  is_active: false,
                  email_verify: false,
                  created_at: new Date(),
                  updated_at: new Date(),
            };

            const created_user = await user_collection.insertOne(user);

            await workspace_collection.updateOne({
                  _id: new ObjectId(data.company_id)
            }, {
                  $set: {
                        //add new staff
                        staff: [...find_work_space.staff, {

                              name: data.name,
                              role: data.role,
                              _id: created_user.insertedId.toString(),
                        }]
                  }
            })


            const new_data = {
                  _id: created_user.insertedId.toString(),
                  ...user,
            }
            delete new_data.password

            // Send email with OTP
            send_email({
                  email: [data.email],
                  subject: "Email Verification",
                  html: generateVerificationEmail({
                        email: data.email,
                        verification_code: otp, // Include OTP in the email template
                        verifyLink: `http://localhost:3000/verify_otp`,
                  }),
            });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "OTP sent to your email. Please verify.",
                  data: new_data,
            });
      } catch (error) {
            next(error);
      }
};

const get_workspace_hr = async (req, res, next) => {
      try {
            const workspace_id = req.query.workspace_id;

            // role:   "workspace_admin"
            const workspace = await user_collection.find({
                  company_id: workspace_id,
                  role: { $ne: "workspace_admin" }
            }).toArray();



            if (!workspace) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Workspace not found",
                  });
            }
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Workspace fetched successfully",
                  data: workspace,
            });
      } catch (error) {
            next(error);
      }
};


const create_user_as_a_job_sucker = async (req, res, next) => {

      try {
            let data = req.body;
            if (!data) {
                  throw new Error('User data is required');
            }

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

            if (password.length < 6) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Password must be at least 6 characters long",
                  });
            }

            if (!data.email) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Email is required",
                  });
                  return;
            }

            const existingUser = await user_collection.findOne({ email: data.email });
            if (existingUser) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "User with this email already exists. Please log in or use a different email.",
                  });
                  return;
            }


            // Check if the email already exists in the in-memory store
            if (otpStore[data.email]) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "User already exists or OTP already sent. Please verify your email.",
                  });
                  return;
            }

            // const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
            const otp = 123456;
            const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
            otpStore[data.email] = { otp, expiry: otpExpiry }; // Store OTP and expiry in memory

            const user_data = {
                  email: data.email,
                  password: password,
            }
            // Hash the password
            await password_backup.insertOne(user_data);
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = {
                  ...data,
                  password: hashedPassword, // Store the hashed password instead of the plain one
                  address: {},
                  gender: '',
                  role: "job_sucker",
                  date_of_birth: '',
                  preferences: {
                        job_alerts: true,
                        news_letter: true,
                  },
                  company_status: false,
                  social_links: {},
                  is_active: true,
                  email_verify: false,
                  payment_id: '',
                  created_at: new Date(),
                  updated_at: new Date(),
            };


            const created_user = await user_collection.insertOne(user);
            const get_user_data = await user_collection.findOne({ _id: created_user.insertedId });
            delete get_user_data.password;
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "User created successfully",
                  data: get_user_data,
            });
      } catch (error) {
            next(error);
      }
}


module.exports = { create_user, verify_email, regenerate_otp, create_new_hr_and_user, get_workspace_hr, create_user_as_a_job_sucker };
