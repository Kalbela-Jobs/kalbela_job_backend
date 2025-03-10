const { ObjectId } = require("mongodb");
const { user_collection } = require("../../../collection/collections/auth");
const { response_sender } = require("../../hooks/respose_sender");
const { workspace_collection } = require("../../../collection/collections/system");
const generateVerificationEmail = require("../../../mail/template/vericicationmail");
const { send_email } = require("../../../mail/send_email");

const create_new_workspace_user = async (req, res, next) => {
      try {
            let data = req.body;
            if (!data) {
                  throw new Error('User data is required');
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

            const find_user = await user_collection.findOne({ email: data.email, role: "workspace_admin" });
            if (find_user) {
                  response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "User already exists",
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


            const user = {
                  ...data,
                  password: '',
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



            const encodedEmail = btoa(data.email);
            const set_copy_url = `https://kalbelajobs.com/set_password?q=${encodedEmail}`;

            // Send email with OTP
            send_email({
                  email: [data.email],
                  subject: `Action Required: Set Your Password for ${find_work_space.name} as a ${data.role} on Kalbela Jobs`,
                  html: generateVerificationEmail({
                        email: data.email,
                        verification_code: set_copy_url, // Include OTP in the email template
                        verifyLink: set_copy_url,
                  }),
            });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "User created successfully",
                  data: set_copy_url,
            });
      } catch (error) {
            next(error);
      }
};

const delete_workspace_staff = async (req, res, next) => {
      try {
            const { staff_id, workplace_id } = req.query;
            console.log(staff_id, workplace_id);

            const workspaceId = new ObjectId(workplace_id);

            await workspace_collection.updateOne(
                  { _id: workspaceId },
                  { $pull: { staff: { _id: staff_id } } } // Matching by string _id
            );

            // Delete the user from the user collection
            await user_collection.deleteOne({ _id: new ObjectId(staff_id) });

            // Send success response
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "User deleted successfully",
            });
      } catch (error) {
            next(error);
      }
};




module.exports = {
      create_new_workspace_user,
      delete_workspace_staff
};
