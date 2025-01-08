const { ObjectId } = require("mongodb")
const { education_collection } = require("../../../collection/collections/users_activity")
const { response_sender } = require("../../hooks/respose_sender")

const upload_education = async (req, res, next) => {
      try {
            const data = req.body
            if (!data.user_id) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "No user id provided",
                        data: null,
                  })
            }
            data.created_at = new Date()
            data.updated_at = new Date()
            const create_data = await education_collection.insertOne(data)
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Create new education successful",
                  data: create_data,
            })
      } catch (error) {
            next(error)
      }
}

const get_education = async (req, res, next) => {
      try {
            const user_id = req.query.user_id
            const educations = await education_collection.find({ user_id }).sort({ created_at: -1 }).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Education fetched successfully",
                  data: educations,
            });
      } catch (error) {
            next(error);
      }
}

const delete_education = async (req, res, next) => {
      try {
            const { education_id } = req.query;
            await education_collection.deleteOne({ _id: new ObjectId(education_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Education deleted successfully",
            });
      } catch (error) {
            next(error);
      }
}

const update_education = async (req, res, next) => {
      try {
            const data = req.body
            const education_id = req.query.education_id
            const query = { _id: new ObjectId(education_id) }
            await education_collection.updateOne(query, {
                  $set: { ...data }
            })
            const education = await education_collection.findOne(query)
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Education update successful",
                  data: education,
            })
      } catch (error) {
            next(error)
      }

}

module.exports = {
      upload_education,
      get_education,
      delete_education,
      update_education
}
