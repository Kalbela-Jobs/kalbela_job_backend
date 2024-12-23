const { ObjectId } = require("mongodb");
const { save_jobs_collection } = require("../../../collection/collections/users_activity");

const save_jobs = async (req, res, next) => {
      try {
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
            const data = await save_jobs_collection.insertOne(body);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job saved successfully",
                  data: data,
            });
      } catch (err) {
            next(err);
      }
};

module.exports = { save_jobs };
