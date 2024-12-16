const { ObjectId } = require("mongodb");
const { user_collection } = require("../../collection/collections/auth");
const { workspace_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");

const create_a_workspace = async (req, res, next) => {
      const data = req.body;
      data.priority = 'medium';
      data.status = true;
      data.updated_at = new Date();
      data.created_at = new Date();

      const query = {
            company_website: data.company_website,
      }
      const workspace = await workspace_collection.findOne(query);
      if (workspace) {
            return response_sender({
                  res,
                  status_code: 400,
                  error: true,
                  message: "Workspace website already exists. Please change the website name and try again",
            });
      }


      const result = await workspace_collection.insertOne(data);
      const update_user = await user_collection.updateOne(
            {
                  _id: new ObjectId(data.staff[0]._id)
            },
            {
                  $set: {
                        company_id: result.insertedId
                  }
            }
      )

      const find_user = await user_collection.findOne({ _id: new ObjectId(data.staff[0]._id) });

      const new_data = {
            ...data,
            _id: result.insertedId,
      };
      delete new_data.staff;
      delete find_user.password;


      try {
            return response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Workspace created successfully",
                  data: {
                        workspace: new_data,
                        user: find_user
                  },
            });
      } catch (err) {
            next(err);
      }
};


module.exports = { create_a_workspace };
