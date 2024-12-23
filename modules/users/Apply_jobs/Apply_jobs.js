const { ObjectId } = require("mongodb");
const { jobs_collection } = require("../../../collection/collections/system");
const { apply_jobs_collection } = require("../../../collection/collections/users_activity");

const apply_jobs = async (req, res, next) => {
      const body = req.body;
      body.created_at = new Date();
      body.updated_at = new Date();
      const job_post = await jobs_collection.findOne({ _id: new ObjectId(body.job_id) });
      if (!job_post) {
            return response_sender({
                  res,
                  status_code: 404,
                  error: true,
                  message: "Job not found",
                  data: null,
            });
      }

      try {
            const data = await apply_jobs_collection.insertOne(body);
            await jobs_collection.updateOne({ _id: new ObjectId(body.job_id) }, { $set: { applications_count: job_post.applications_count + 1 } });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job applied successfully",
                  data: data,
            });
      } catch (error) {
            next(error);
      }
}


module.exports = { apply_jobs }
