const { ObjectId } = require("mongodb");
const { save_jobs_collection } = require("../../../collection/collections/users_activity");
const { jobs_collection } = require("../../../collection/collections/system");
const { response_sender } = require("../../hooks/respose_sender");

const save_jobs = async (req, res, next) => {
      try {
            const body = req.body;
            const job_query = { job_id: body.job_id, user_id: body.user_id }
            const find_jobs = await save_jobs_collection.findOne(job_query)
            if (find_jobs) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "This jobs already saved",
                        data: null,
                  });
            }
            else {
                  const job_post = await jobs_collection.findOne({ _id: new ObjectId(body.job_id) })
                  body.created_at = new Date();
                  body.updated_at = new Date();
                  body.status = 'pending';

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
            }

      } catch (err) {
            next(err);
      }
};

const get_saved_jobs = async (req, res, next) => {
      try {
            const { user_id } = req.query;
            const saved_jobs = await save_jobs_collection.find({ user_id: user_id }).sort({ created_at: -1 }).toArray();
            const jobs = await Promise.all(
                  saved_jobs.map(async (job) => {
                        const job_post = await jobs_collection.findOne({ _id: new ObjectId(job.job_id) }, {
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
                                    url: 1,
                                    salary_range: 1,

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
                  message: "Saved jobs fetched successfully",
                  data: jobs,
            });
      } catch (err) {
            next(err);
      }
};

module.exports = { save_jobs, get_saved_jobs };
