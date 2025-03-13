const { ObjectId } = require("mongodb");
const { govt_org_collection } = require("../../collection/collections/content");
const { response_sender } = require("../hooks/respose_sender");
const { govt_jobs_collection } = require("../../collection/collections/system");

const add_govt_org = async (req, res, next) => {
      try {
            const govt_org_data = req.body;
            govt_org_data.created_at = new Date();
            govt_org_data.updated_at = new Date();
            const govt_org = await govt_org_collection.insertOne(govt_org_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Govt org added successfully",
                  data: govt_org,
            });
      } catch (error) {
            next(error);
      }
};

const update_govt_org = async (req, res, next) => {
      try {
            const { govt_org_id } = req.query;
            const updates = req.body;
            console.log(updates);

            if (!govt_org_id || !ObjectId.isValid(govt_org_id)) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Invalid or missing government organization ID",
                  });
            }

            const org_data = {
                  name: updates.name,
                  logo: updates.logo,
                  description: updates.description,
                  org_website: updates.org_website,
                  updated_at: new Date(),
                  banner: updates.banner,
            };

            const govt_org_update_result = await govt_org_collection.updateOne(
                  { _id: new ObjectId(govt_org_id) },
                  { $set: org_data }
            );

            if (govt_org_update_result.matchedCount === 0) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Government organization not found",
                  });
            }

            const govt_jobs_update_result = await govt_jobs_collection.updateMany(
                  { "organization.id": govt_org_id },
                  { $set: { organization: org_data } }
            );



            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Government organization updated successfully",
                  data: {
                        govt_org_update_result,
                        govt_jobs_update_result,
                  },
            });
      } catch (error) {
            next(error);
      }
};

const delete_govt_org = async (req, res, next) => {
      try {
            const { govt_org_id } = req.query;

            const govt_org = await govt_org_collection.deleteOne({ _id: new ObjectId(govt_org_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Govt org deleted successfully",
                  data: govt_org,
            });
      } catch (error) {
            next(error);
      }
};

const get_all_govt_org = async (req, res, next) => {
      try {
            const govt_org = await govt_org_collection.find().toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Govt org fetched successfully",
                  data: govt_org,
            });
      } catch (error) {
            next(error);
      }
};

module.exports = { add_govt_org, delete_govt_org, get_all_govt_org, update_govt_org };
