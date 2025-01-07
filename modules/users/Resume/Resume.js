const { ObjectId } = require("mongodb")
const { resume_collection } = require("../../../collection/collections/users_activity")
const { response_sender } = require("../../hooks/respose_sender")


const upload_resume = async (req, res, next) => {
      try {
            const data = req.body
            data.created_at = new Date()
            data.updated_at = new Date()
            const create_data = await resume_collection.insertOne(data)
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Create new resume successful",
                  data: create_data,
            })

      } catch (error) {
            next(error)
      }
}

const get_resume = async (req, res, next) => {
      try {
            const user_id = req.query.user_id
            const resumes = await resume_collection.find({ user_id }).sort({ created_at: -1 }).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Resume fetched successfully",
                  data: resumes,
            });
      } catch (error) {
            next(error);
      }
}

const delete_resume = async (req, res, next) => {
      try {
            const { resume_id } = req.query;
            await resume_collection.deleteOne({ _id: new ObjectId(resume_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Resume deleted successfully",
            });
      } catch (error) {
            next(error);
      }
}

module.exports = {
      upload_resume,
      get_resume,
      delete_resume
}
