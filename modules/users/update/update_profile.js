const { ObjectId } = require("mongodb");
const { user_collection } = require("../../../collection/collections/auth");
const { response_sender } = require("../../hooks/respose_sender");

const validateUpdateData = (data) => {
      const allowedFields = [
            "full_name", "father_name", "mother_name", "date_of_birth", "gender",
            "religion", "nationality", "passport_number", "passport_issue_date", "nid",
            "primary_mobile", "secondary_mobile", "alternate_email", "height", "weight", "profile_picture", "language", "present_address", "permanent_address", "preferences", "social_links"
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

const update_profile_picture = async (req, res, next) => {
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
            if (!req.body.profile_picture) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Profile picture is required",
                  });
            }

            await user_collection.updateOne(
                  { _id: new ObjectId(id) },
                  { $set: { profile_picture: req?.body?.profile_picture } }
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
                  message: "Profile picture updated successfully",
                  data: user,
            });
      } catch (error) {
            next(error);
      }
};

const update_profile_address = async (req, res, next) => {
      try {
            const { id } = req.query;
            const permanent_address = {
                  permanentArea: req?.body?.permanentArea,
                  permanentCity: req?.body?.permanentCity,
                  permanentCountry: req?.body?.permanentCountry,
                  permanentDivision: req?.body?.permanentDivision,
                  permanentAddress: req?.body?.permanentAddress,
                  permanentFullAddress: req?.body?.permanentFullAddress
            }
            const present_address = {
                  presentArea: req?.body?.presentArea,
                  presentCity: req?.body?.presentCity,
                  presentCountry: req?.body?.presentCountry,
                  presentDivision: req?.body?.presentDivision,
                  presentAddress: req?.body?.presentAddress,
                  presentFullAddress: req?.body?.presentFullAddress
            }
            if (!permanent_address && !present_address) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Address is required",
                  });
            }

            await user_collection.updateOne(
                  { _id: new ObjectId(id) },
                  { $set: { permanent_address, present_address } }
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
                  message: "Address updated successfully",
                  data: user,
            });
      } catch (error) {
            next(error);
      }
}


const update_career_objective = async (req, res, next) => {
      try {
            const { id } = req.query;
            const career_objective = req?.body?.career_objective;

            if (career_objective?.career_objective && career_objective?.expected_salary && career_objective?.job_level && career_objective?.job_nature && career_objective?.present_salary) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Career objective is required",
                  });
            }
            if (!career_objective) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Career objective is required",
                  });
            }

            await user_collection.updateOne(
                  { _id: new ObjectId(id) },
                  { $set: { career_objective } }
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
                  message: "Career objective updated successfully",
                  data: user,
            });
      } catch (error) {
            next(error);
      }
};





module.exports = { update_profile_data, update_language, update_profile_picture, update_profile_address, update_career_objective };
