const { ObjectId } = require("mongodb");
const { govt_jobs_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");
const { govt_org_collection } = require("../../collection/collections/content");

const create_govt_jobs = async (req, res, next) => {
      try {
            const job_data = req.body;
            console.log(job_data);
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


const get_single_govt_jobs = async (req, res, next) => {
      try {
            const { job_id } = req.query;
            if (!job_id) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Job ID is required",
                  });
            }

            const job = await govt_jobs_collection.findOne({ _id: new ObjectId(job_id) });

            if (!job) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Job not found",
                  });
            }

            // Check if views is an array or string, and set the new value
            let newViews = 0;
            if (Array.isArray(job.views)) {
                  newViews = job.views.length > 0 ? job.views.length + 1 : 2;
            } else if (typeof job.views === 'string') {
                  newViews = job.views.length > 0 ? parseInt(job.views) + 1 : 2;
            } else {
                  // If views is a number or other data type, just increment by 1
                  newViews = (job.views ?? 0) + 1;
            }

            await govt_jobs_collection.updateOne(
                  { _id: new ObjectId(job_id) },
                  { $set: { views: newViews } }
            );

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Govt job fetched successfully",
                  data: job,
            });
      } catch (error) {
            next(error);
      }
};


const get_govt_job_suggestions_by_org = async (req, res, next) => {
      const { org_id } = req.query;
      try {
            const jobs = await govt_jobs_collection.find({ 'organization.id': org_id, }).toArray();

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
}


// const get_all_govt_org_and_jobs = async (req, res, next) => {
//       try {
//             // Fetch organizations and group jobs by organization ID using aggregation
//             const [jobs, orgs] = await Promise.all([
//                   govt_jobs_collection.aggregate([
//                         { $group: { _id: "$organization.id", jobs: { $push: "$$ROOT" } } },
//                         { $project: { org_id: "$_id", jobs: 1, job_count: { $size: "$jobs" }, _id: 0 } }
//                   ]).toArray(),
//                   govt_org_collection.find({}).toArray()
//             ]);

//             // Create a map for easy lookup of jobs by org_id
//             const jobMap = jobs.reduce((acc, job) => {
//                   acc[job.org_id] = job;
//                   return acc;
//             }, {});

//             // Merge organization data with job count and jobs
//             const orgs_with_jobs = orgs.map(org => {
//                   const orgJobs = jobMap[org._id.toString()];
//                   return {
//                         ...org,
//                         jobs: orgJobs ? orgJobs.jobs : [],
//                         job_count: orgJobs ? orgJobs.job_count : 0
//                   };
//             });

//             response_sender({
//                   res,
//                   status_code: 200,
//                   error: false,
//                   message: "Govt jobs fetched successfully",
//                   data: orgs_with_jobs,
//             });
//       } catch (error) {
//             next(error);
//       }
// };


const get_all_govt_org_and_jobs = async (req, res, next) => {
      try {
            const currentDate = new Date(); // Get the current date

            // Fetch organizations and group jobs by organization ID using aggregation
            const [jobs, orgs] = await Promise.all([
                  govt_jobs_collection.aggregate([
                        {
                              $addFields: {
                                    applicationDeadlineDate: { $toDate: "$applicationDeadline" } // Convert string to Date
                              }
                        },
                        {
                              $match: {
                                    applicationDeadlineDate: { $gte: currentDate } // Only include jobs with valid deadlines
                              }
                        },
                        {
                              $group: {
                                    _id: "$organization.id",
                                    jobs: { $push: "$$ROOT" }
                              }
                        },
                        {
                              $project: {
                                    org_id: "$_id",
                                    jobs: 1,
                                    job_count: { $size: "$jobs" },
                                    _id: 0
                              }
                        }
                  ]).toArray(),
                  // by created_at
                  (await govt_org_collection.find({}).toArray()).sort((a, b) => b.created_at - a.created_at)
            ]);

            // Create a map for easy lookup of jobs by org_id
            const jobMap = jobs.reduce((acc, job) => {
                  acc[job.org_id] = job;
                  return acc;
            }, {});

            // Merge organization data with job count and jobs
            const orgs_with_jobs = orgs
                  .map(org => {
                        const orgJobs = jobMap[org._id.toString()];
                        return {
                              ...org,
                              jobs: orgJobs ? orgJobs.jobs : [],
                              job_count: orgJobs ? orgJobs.job_count : 0
                        };
                  })
                  .filter(org => org.jobs.length > 0); // Remove organizations with no jobs

            // Response handling
            if (orgs_with_jobs.length === 0) {
                  response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "No organizations with jobs found",
                        data: [],
                  });
            } else {
                  response_sender({
                        res,
                        status_code: 200,
                        error: false,
                        message: "Govt jobs fetched successfully",
                        data: orgs_with_jobs,
                  });
            }
      } catch (error) {
            next(error);
      }
};


module.exports = { create_govt_jobs, get_all_govt_jobs, delete_govt_jobs, get_single_govt_jobs, get_govt_job_suggestions_by_org, get_all_govt_org_and_jobs };
