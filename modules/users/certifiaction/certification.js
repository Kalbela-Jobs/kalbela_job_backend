const { ObjectId } = require("mongodb")
const { certification_collection } = require("../../../collection/collections/users_activity")
const { response_sender } = require("../../hooks/respose_sender")

const post_certification = async (req, res, next) => {
      try {
            const data = req.body
            data.created_at = new Date()
            data.updated_at = new Date()
            const create_data = await certification_collection.insertOne(data)
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Create new certification successful",
                  data: create_data,
            })
      } catch (error) {
            next(error)
      }
}

const get_certification = async (req, res, next) => {
      try {
            const user_id = req.query.user_id
            const certifications = await certification_collection.find({ user_id }).sort({ created_at: -1 }).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Certification fetched successfully",
                  data: certifications,
            });
      } catch (error) {
            next(error);
      }
}

const delete_certification = async (req, res, next) => {
      try {
            const { certification_id } = req.query;
            await certification_collection.deleteOne({ _id: new ObjectId(certification_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Certification deleted successfully",
            });
      } catch (error) {
            next(error);
      }
}

const update_certification = async (req, res, next) => {
      try {
            const data = req.body
            const certification_id = req.query.certification_id
            const query = { _id: new ObjectId(certification_id) }
            await certification_collection.updateOne(query, {
                  $set: { ...data }
            })
            const certification = await certification_collection.findOne(query)
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Certification update successful",
                  data: certification,
            })
      } catch (error) {
            next(error)
      }
}

module.exports = { post_certification, get_certification, delete_certification, update_certification }
