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
      const new_data = {
            ...data,
            _id: result.insertedId,
      };
      delete new_data.staff;

      try {
            return response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Workspace created successfully",
                  data: new_data,
            });
      } catch (err) {
            next(err);
      }
};


module.exports = { create_a_workspace };
