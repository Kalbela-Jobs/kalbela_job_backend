const { ObjectId } = require("mongodb")
const { experience_collection } = require("../../../collection/collections/users_activity")
const { response_sender } = require("../../hooks/respose_sender")

const upload_experience = async (req, res, next) => {
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
            const create_data = await experience_collection.insertOne(data)
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Create new experience successful",
                  data: create_data,
            })
      } catch (error) {
            next(error)
      }
}

const get_experience = async (req, res, next) => {
      try {
            const user_id = req.query.user_id
            const experiences = await experience_collection.find({ user_id }).sort({ created_at: -1 }).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Experience fetched successfully",
                  data: experiences,
            });
      } catch (error) {
            next(error);
      }
}

const delete_experience = async (req, res, next) => {
      try {
            const { experience_id } = req.query;
            await experience_collection.deleteOne({ _id: new ObjectId(experience_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Experience deleted successfully",
            });
      } catch (error) {
            next(error);
      }
}

const update_experience = async (req, res, next) => {

      try {
            const data = req.body
            const experience_id = req.query.experience_id
            const query = { _id: new ObjectId(experience_id) }
            await experience_collection.updateOne(query, {
                  $set: { ...data }
            })
            const experience = await experience_collection.findOne(query)
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Experience update successful",
                  data: experience,
            })
      } catch (error) {
            next(error)
      }

}

module.exports = {
      upload_experience,
      get_experience,
      delete_experience,
      update_experience
}
