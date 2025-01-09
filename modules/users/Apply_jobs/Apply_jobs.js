const { ObjectId } = require("mongodb");
const { jobs_collection } = require("../../../collection/collections/system");
const { apply_jobs_collection } = require("../../../collection/collections/users_activity");
const { response_sender } = require("../../hooks/respose_sender");

const apply_jobs = async (req, res, next) => {
      try {
            const body = req.body;
            const job_query = { job_slug: body.job_slug, user_id: body.user_id }
            const find_jobs = await apply_jobs_collection.findOne(job_query)
            if (find_jobs) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "This jobs already applied",
                        data: null,
                  });
            }
            else {
                  const job_post = await jobs_collection.findOne({ url: body.job_slug })
                  await jobs_collection.updateOne({ _id: job_post._id }, { $inc: { applications_count: 1 } })
                  body.created_at = new Date();
                  body.updated_at = new Date();
                  body.status = "Applied";

                  if (!job_post) {
                        return response_sender({
                              res,
                              status_code: 404,
                              error: true,
                              message: "Job not found",
                              data: null,
                        });
                  }
                  const data = await apply_jobs_collection.insertOne(body);
                  response_sender({
                        res,
                        status_code: 200,
                        error: false,
                        message: "Job applied successfully",
                        data: data,
                  });
            }

      } catch (err) {
            next(err);
      }
};

const get_applied_jobs = async (req, res, next) => {
      try {
            const user_id = req.query.user_id;
            const applied_jobs = await apply_jobs_collection.find({ user_id }, {
                  projection: {
                        job_slug: 1,
                        created_at: 1,
                        status: 1
                  }
            }).sort({ created_at: -1 }).toArray();

            const jobs = await Promise.all(
                  applied_jobs.map(async (job) => {
                        const job_post = await jobs_collection.findOne({ url: job.job_slug }, {
                              projection: {
                                    job_title: 1,
                                    salary_range: 1,
                                    job_type: 1,
                                    experience_level: 1,
                                    location: 1,
                                    expiry_date: 1,
                                    company_info: {
                                          name: 1,
                                          logo: 1,
                                    },
                                    salary_negotiable: 1,
                                    url: 1,
                                    status: 1,
                              },
                        });
                        return {
                              job_post,
                              ...job,
                        };
                  })
            );
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Applied jobs fetched successfully",
                  data: jobs,
            });
      } catch (error) {
            next(error);
      }
}



module.exports = { apply_jobs, get_applied_jobs }
