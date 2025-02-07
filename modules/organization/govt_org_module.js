const { ObjectId } = require("mongodb");
const { govt_org_collection } = require("../../collection/collections/content");
const { response_sender } = require("../hooks/respose_sender");

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

module.exports = { add_govt_org, delete_govt_org, get_all_govt_org };
