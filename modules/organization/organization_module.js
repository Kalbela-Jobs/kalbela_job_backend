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


const get_all_workspaces = async (req, res, next) => {
      try {
            const workspaces = await workspace_collection.find().toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Workspaces fetched successfully",
                  data: workspaces,
            });
      } catch (error) {
            next(error);
      }
}

const get_workspace = async (req, res, next) => {
      try {
            const { company_website } = req.query;
            const workspace = await workspace_collection.findOne({ company_website });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Workspace Information fetched successfully",
                  data: workspace,
            });
      } catch (error) {
            next(error);
      }
}

const update_workspace = async (req, res, next) => {
      try {
            const data = req.body
            const workspace_id = req.query.workspace_id
            const query = { _id: new ObjectId(workspace_id) }
            await workspace_collection.updateOne(query, {
                  $set: { ...data }
            })
            const workspace = await workspace_collection.findOne(query)
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Workspace update successful",
                  data: workspace,
            })
      } catch (error) {
            next(error)
      }

}


module.exports = { create_a_workspace, get_workspace, get_all_workspaces, update_workspace };
