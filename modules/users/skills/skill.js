const { user_skill_collection } = require("../../../collection/collections/users_activity")
const { response_sender } = require("../../hooks/respose_sender")

const update_user_skill = async (req, res, next) => {
      try {
            const data = req.body; // The skills data from the request body
            const user_id = req.query.user_id; // The user ID from the query parameter
            const query = {
                  user_id: user_id
            };
            console.log(data, user_id);
            const find_skill = await user_skill_collection.findOne(query)
            console.log(find_skill);
            if (!find_skill) {
                  const create_skill = await user_skill_collection.insertOne(data)
                  response_sender({
                        res,
                        status_code: 200,
                        error: false,
                        message: "User skill created successfully",
                        data: create_skill,
                  })
                  return
            }
            else {
                  const update_skill = await user_skill_collection.updateOne(query, { $set: { skills: data.skills } })
                  response_sender({
                        res,
                        status_code: 200,
                        error: false,
                        message: "User skill update successful",
                        data: update_skill,
                  });
            }

      } catch (error) {
            next(error);
      }
};



const get_user_skill = async (req, res, next) => {
      try {
            const user_id = req.query.user_id

            const skill = await user_skill_collection.findOne({ user_id }, {
                  projection: { _id: 0, user_id: 0, }
            })

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "User skill fetched successfully",
                  data: skill?.skills || [],
            })
      } catch (error) {
            next(error)
      }
}


module.exports = {
      update_user_skill,
      get_user_skill
}
