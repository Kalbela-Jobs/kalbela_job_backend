const { ObjectId } = require("mongodb");
const { user_collection } = require("../../collection/collections/auth");
const { workspace_collection, jobs_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");
const { apply_jobs_collection, save_jobs_collection } = require("../../collection/collections/users_activity");
const { client } = require("../../collection/uri");

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
            const { page, limit, search } = req.query; // Default values for page, limit, and search
            const currentPage = parseInt(page, 10) || 1;
            const pageSize = parseInt(limit, 10) || 10;

            const query = search
                  ? {
                        company_name: { $regex: search, $options: "i" }
                  } // Assuming workspace has a 'name' field
                  : {};



            const totalWorkspaces = await workspace_collection.countDocuments(query);

            const workspaces = await workspace_collection
                  .find(query)
                  .skip((currentPage - 1) * pageSize)
                  .limit(pageSize)
                  .toArray();

            console.log(workspaces);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Workspaces fetched successfully",
                  data: {
                        total: totalWorkspaces,
                        page: currentPage,
                        limit: pageSize,
                        workspaces,
                  },
            });
      } catch (error) {
            next(error);
      }
};


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
            // need to update workspace all jobs with new data
            await jobs_collection.updateMany({ 'company_info.company_id': workspace._id.toString() }, {
                  $set: {
                        'company_info': {
                              name: workspace.company_name,
                              logo: workspace.logo,
                              website: workspace.website,
                              company_size: workspace.company_size,
                              industry: workspace.industry,
                              about: workspace.about,
                              company_address: workspace.company_address
                        }
                  }
            })
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

const get_feature_org = async (req, res, next) => {
      try {
            const workspace = await workspace_collection.find({ feature: true }).toArray();
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

const delete_organization = async (req, res, next) => {
      const session = await client.startSession()
      session.startTransaction();

      try {
            const { workspace_id } = req.query;

            // Validate workspace_id
            if (!ObjectId.isValid(workspace_id)) {
                  throw new Error("Invalid workspace ID");
            }

            const orgId = new ObjectId(workspace_id);

            // Delete workspace
            const workspaceResult = await workspace_collection.deleteOne({ _id: orgId }, { session });
            if (!workspaceResult.deletedCount) {
                  throw new Error("Workspace not found or already deleted.");
            }

            // Fetch and delete related jobs
            const deletedJobs = await jobs_collection.find({ organization_id: workspace_id }, { session }).toArray();
            const deletedJobIds = deletedJobs.map((job) => job._id.toString());
            await jobs_collection.deleteMany({ organization_id: workspace_id }, { session });

            // Delete applied jobs
            await apply_jobs_collection.deleteMany({ organization_id: workspace_id }, { session });

            // Delete saved jobs for deleted job IDs
            if (deletedJobIds.length > 0) {
                  await save_jobs_collection.deleteMany(
                        { job_id: { $in: deletedJobIds } },
                        { session }
                  );
            }

            // Commit the transaction
            await session.commitTransaction();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Workspace and related data deleted successfully",
            });
      } catch (error) {
            // Rollback transaction on error
            await session.abortTransaction();
            next(error);
      } finally {
            // End the session
            session.endSession();
      }
};



module.exports = { create_a_workspace, get_workspace, get_all_workspaces, update_workspace, get_feature_org, delete_organization };
