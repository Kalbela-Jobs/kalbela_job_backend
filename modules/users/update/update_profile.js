const { ObjectId } = require("mongodb");
const { user_collection } = require("../../../collection/collections/auth");
const { response_sender } = require("../../hooks/respose_sender");

const update_profile_data = async (req, res, next) => {
      try {
            const { id } = req.query;
            const update_data = req.body;
            await user_collection.updateOne(
                  { _id: new ObjectId(id) },
                  { $set: update_data }
            );

            const user = await user_collection.findOne({ _id: new ObjectId(id) });
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



module.exports = { update_profile_data };
