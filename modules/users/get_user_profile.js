const { ObjectId } = require("mongodb")
const { user_collection } = require("../../collection/collections/auth")
const { response_sender } = require("../hooks/respose_sender")
const { certification_collection, experience_collection, user_skill_collection, education_collection } = require("../../collection/collections/users_activity")

const get_user_profile = async (req, res, next) => {
      try {
            const { user_id } = req.query
            let user = await user_collection.findOne({ _id: new ObjectId(user_id) })
            if (!user) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "User not found",
                        data: null
                  })
            }
            delete user.password
            delete user.role
            delete user._id
            delete user.preferences
            delete user.payment_id
            user.certifications = await certification_collection.find({ user_id: user_id }).toArray()
            user.experience = await experience_collection.find({ user_id: user_id }).toArray()
            user.skills = await user_skill_collection.findOne({ user_id: user_id })
            user.education = await education_collection.find({ user_id: user_id }).toArray()
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "User profile fetched successfully",
                  data: user
            })
      } catch (error) {
            next(error)
      }
}

module.exports = { get_user_profile }
