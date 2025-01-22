const { ObjectId } = require("mongodb");
const { govt_jobs_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");

const create_govt_jobs = async (req, res, next) => {
      try {
            const job_data = req.body;
            job_data.created_at = new Date();
            job_data.updated_at = new Date();
            job_data.status = true;
            await govt_jobs_collection.insertOne(job_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Govt job created successfully",
                  data: job_data,
            });
      } catch (error) {
            next(error);
      }
};


const get_all_govt_jobs = async (req, res, next) => {
      try {
            const jobs = await govt_jobs_collection.find().toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Govt jobs fetched successfully",
                  data: jobs,
            });
      } catch (error) {
            next(error);
      }
};

const delete_govt_jobs = async (req, res, next) => {
      try {
            const { job_id } = req.query;
            console.log(job_id);
            await govt_jobs_collection.deleteOne({ _id: new ObjectId(job_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Govt job deleted successfully",
            });
      } catch (error) {
            next(error);
      }
};

module.exports = { create_govt_jobs, get_all_govt_jobs, delete_govt_jobs };
