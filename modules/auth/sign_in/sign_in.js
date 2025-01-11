const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');
const { response_sender } = require("../../hooks/respose_sender");
const { user_collection } = require("../../../collection/collections/auth");
const { workspace_collection } = require("../../../collection/collections/system");

const sign_in = async (req, res, next) => {
      try {
            const input_data = req.body;

            if (!input_data.email || !input_data.password) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        data: null,
                        message: "Email and password are required.",
                  });
            }

            // Find the user by email
            const find_user = await user_collection.findOne({
                  email: input_data.email,
                  role: { $ne: "job_sucker" }
            });


            if (!find_user) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        data: null,
                        message: "This email is not registered as a Employer.",
                  });
            }


            const isPasswordValid = await bcrypt.compare(input_data?.password, find_user?.password);
            if (!isPasswordValid) {
                  return response_sender({
                        res,
                        status_code: 401,
                        error: true,
                        data: null,
                        message: "Password is incorrect. Please try again.",
                  });
            }

            const { password, ...userData } = find_user;







            if (!find_user?.company_id && find_user?.role === 'super_admin') {
                  return response_sender({
                        res,
                        status_code: 200,
                        error: false,
                        data: {
                              user: userData,
                              workspace: 'No workspace found for super admin',
                        },
                  });
            }
            if (find_user?.company_id && find_user?.role !== 'super_admin') {

            }

            const workspace = await workspace_collection.findOne({ _id: new ObjectId(find_user?.company_id) });

            if (!workspace && find_user?.role === 'super_admin') {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        data: null,
                        message: "Workspace not found.",
                  });
            }

            if (workspace) {
                  delete workspace.staff
            }





            return response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  data: {
                        user: userData,
                        workspace: workspace,

                  },
                  message: "User signed in successfully.",
            });

      } catch (error) {
            next(error);
      }
};


const sign_in_user = async (req, res, next) => {
      try {
            const { email, password } = req.body;

            if (!email || !password) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        data: null,
                        message: "Email and password are required.",
                  });
            }

            const find_user = await user_collection.findOne({ email, role: "job_sucker" });

            if (!find_user) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        data: null,
                        message: "Email is not registered.",
                  });
            }

            const isPasswordValid = await bcrypt.compare(password, find_user.password);

            if (!isPasswordValid) {
                  return response_sender({
                        res,
                        status_code: 401,
                        error: true,
                        data: null,
                        message: "Incorrect password.",
                  });
            }

            delete find_user.password

            return response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  data: find_user,
                  message: "Login successful.",
            });
      } catch (error) {
            next(error);
      }
};


module.exports = {
      sign_in, sign_in_user
};
