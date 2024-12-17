const { job_type_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");

const create_job_type = async (req, res, next) => {
      try {
            const job_type_data = req.body;
            job_type_data.created_at = new Date();
            job_type_data.updated_at = new Date();
            job_type_data.status = true;
            await job_type_collection.insertOne(job_type_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job type created successfully",
                  data: job_type_data,
            });
      } catch (error) {
            next(error);
      }
}

const get_all_jobs = async (req, res, next) => {
      try {
            const jobs = await job_type_collection.find().toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Jobs fetched successfully",
                  data: jobs,
            });
      } catch (error) {
            next(error);
      }
}

const update_job_type = async (req, res, next) => {
      try {
            const job_type_data = req.body;
            job_type_data.updated_at = new Date();
            await job_type_collection.updateOne({ _id: new ObjectId(job_type_data._id) }, { $set: job_type_data });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job type updated successfully",
                  data: job_type_data,
            });
      } catch (error) {
            next(error);
      }
}

const delete_job_type = async (req, res, next) => {
      try {
            const { job_type_id } = req.params;
            await job_type_collection.deleteOne({ _id: new ObjectId(job_type_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job type deleted successfully",
            });
      } catch (error) {
            next(error);
      }
}

module.exports = { create_job_type, get_all_jobs, update_job_type, delete_job_type }
