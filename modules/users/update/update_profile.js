const { ObjectId } = require("mongodb");
const { user_collection } = require("../../../collection/collections/auth");
const { response_sender } = require("../../hooks/respose_sender");

const validateUpdateData = (data) => {
      const allowedFields = [
            "fullName", "fatherName", "motherName", "dateOfBirth", "gender", "email",
            "religion", "nationality", "passportNumber", "passportIssueDate",
            "primaryMobile", "secondaryMobile", "alternateEmail", "height", "weight", "profile_picture", "language", "presentAddress", "permanentAddress", "preferences", "social_links"
      ];

      for (const key in data) {
            if (!allowedFields.includes(key)) {
                  throw new Error(`Invalid field: ${key}`);
            }
      }
};

const update_profile_data = async (req, res, next) => {
      try {
            const { id } = req.query;
            if (!ObjectId.isValid(id)) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Invalid user ID",
                  });
            }

            const update_data = req.body;
            validateUpdateData(update_data);

            await user_collection.updateOne(
                  { _id: new ObjectId(id) },
                  { $set: update_data }
            );

            const user = await user_collection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "User not found",
                  });
            }

            delete user.password;
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Profile updated successfully",
                  data: user,
            });
      } catch (error) {
            next(error);
      }
};

const update_language = async (req, res, next) => {
      try {
            const { id } = req.query;
            if (!ObjectId.isValid(id)) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Invalid user ID",
                  });
            }
            validateUpdateData(req.body);
            if (!req.body.language || !Array.isArray(req.body.language)) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Language is required and must be an array",
                  });
            }

            await user_collection.updateOne(
                  { _id: new ObjectId(id) },
                  { $set: { language: req.body.language } }
            );

            const user = await user_collection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "User not found",
                  });
            }

            delete user.password;
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Language updated successfully",
                  data: user,
            });
      } catch (error) {
            next(error);
      }
};

module.exports = { update_profile_data, update_language };
