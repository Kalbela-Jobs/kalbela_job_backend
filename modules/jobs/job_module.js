const { ObjectId } = require("mongodb");
const { jobs_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");


const create_job = async (req, res, next) => {


      try {
            const newJob = req.body;
            const find_url = await jobs_collection.findOne({ url: newJob.url });
            if (find_url) {
                  newJob.url = `${newJob.url}-${Date.now()}} `
            }
            newJob.created_at = new Date();
            newJob.updated_at = new Date();
            newJob.status = true;
            newJob.applications_count = 0;
            newJob.feature_status = false;
            const result = await jobs_collection.insertOne(newJob);
            res.status(201).json({
                  status_code: 201,
                  error: false,
                  message: "Job created successfully",
                  data: result,  // Return the inserted job object
            });
      } catch (err) {
            next(err);
      }
};


const update_job = async (req, res, next) => {
      try {
            const { job_id } = req.query; // Get job ID from URL params
            const updates = req.body; // Get fields to update from the request body

            // Validate the job ID
            if (!job_id) {
                  return res.status(400).json({
                        status_code: 400,
                        error: true,
                        message: "Job ID is required",
                  });
            }

            // Validate at least one field is provided for update
            if (Object.keys(updates).length === 0) {
                  return res.status(400).json({
                        status_code: 400,
                        error: true,
                        message: "No fields to update",
                  });
            }

            // Update the job in the database
            const result = await jobs_collection.updateOne(
                  { _id: job_id },
                  {
                        $set: {
                              ...updates,
                              updated_at: new Date(), // Always update the timestamp
                        },
                  }
            );

            // Check if the job exists
            if (result.matchedCount === 0) {
                  return res.status(404).json({
                        status_code: 404,
                        error: true,
                        message: "Job not found",
                  });
            }

            // Respond with the updated job data
            res.status(200).json({
                  status_code: 200,
                  error: false,
                  message: "Job updated successfully",
                  data: updates,  // Return the updated fields
            });
      } catch (err) {
            next(err);
      }
};


const get_all_jobs = async (req, res, next) => {
      try {
            // Extract page and limit from query parameters, with default values
            const page = parseInt(req.query.page) || 1; // Default to page 1
            const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
            const skip = (page - 1) * limit; // Calculate the number of documents to skip

            // Fetch jobs with pagination
            const jobs = await jobs_collection.find({})
                  //       .project({
                  //       job_title: 1,
                  //       _id: 1,
                  //       vacancy: 1,
                  //       expiry_date: 1,
                  //       job_type: 1,
                  //       salary_range: 1,
                  //       company_info: 1,
                  //       url: 1,
                  //       location: 1,
                  // })
                  .skip(skip)
                  .limit(limit)
                  .toArray();

            // Get total count of jobs for calculating total pages
            const totalJobs = await jobs_collection.countDocuments();

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Jobs fetched successfully",
                  data: {
                        jobs,
                        pagination: {
                              totalJobs,
                              currentPage: page,
                              totalPages: Math.ceil(totalJobs / limit),
                              limit,
                        }
                  },
            });
      } catch (err) {
            next(err);
      }
};

// const get_job_search_result = async (req, res, next) => {
//       try {
//             // Extract page, limit, and search parameters from the query
//             const page = parseInt(req.query.page) || 1; // Default page is 1
//             const limit = parseInt(req.query.limit) || 10; // Default limit is 10
//             const skip = (page - 1) * limit; // Calculate the documents to skip

//             // Parse the search query (if provided)
//             const search = req.query.search ? req.query.search.trim() : null;
//             const filter = {};

//             if (search) {
//                   // Dynamically create a search filter for all fields
//                   filter.$or = [];

//                   // Loop over all fields and generate a regex search for each one
//                   const jobFields = [
//                         "title",
//                         "description",
//                         "tags",
//                         "requirements",
//                         "company_id",
//                         "category_id",
//                         "subcategory_id",
//                         "salary_range",
//                         "location",
//                         "employment_type",
//                         "currency",
//                         "company_size"
//                   ];

//                   // Add dynamic regex queries for each field in the $or condition
//                   jobFields.forEach((field) => {
//                         filter.$or.push({ [field]: { $regex: search, $options: "i" } });
//                   });
//             }

//             // Fetch jobs based on the filter and apply pagination
//             const jobs = await jobs_collection.find(filter)
//                   .skip(skip)
//                   .limit(limit)
//                   .toArray();

//             // Total count of matching jobs
//             const totalJobs = await jobs_collection.countDocuments(filter);

//             // Send the response with jobs and pagination metadata
//             response_sender({
//                   res,
//                   status_code: 200,
//                   error: false,
//                   message: "Jobs fetched successfully",
//                   data: {
//                         jobs,
//                         pagination: {
//                               totalJobs,
//                               currentPage: page,
//                               totalPages: Math.ceil(totalJobs / limit),
//                               limit
//                         }
//                   },
//             });
//       } catch (err) {
//             next(err);
//       }
// };
const get_job_search_result = async (req, res, next) => {
      try {
            const searchQuery = req.query.search || ""; // Get search term from the query string
            const page = parseInt(req.query.page) || 1; // Get the current page from query, default to 1
            const limit = parseInt(req.query.limit) || 10; // Get the limit per page from query, default to 10
            const skip = (page - 1) * limit; // Calculate the number of items to skip for pagination

            // Build the search condition dynamically for any field, including nested fields
            const searchCondition = {
                  $or: [
                        { title: { $regex: searchQuery, $options: "i" } },
                        { description: { $regex: searchQuery, $options: "i" } },
                        { requirements: { $regex: searchQuery, $options: "i" } },
                        { tags: { $regex: searchQuery, $options: "i" } },
                        { benefits: { $regex: searchQuery, $options: "i" } },
                        { company_size: { $regex: searchQuery, $options: "i" } },
                        { experience_level: { $regex: searchQuery, $options: "i" } },
                        { location: { $regex: searchQuery, $options: "i" } },
                        { "location.city": { $regex: searchQuery, $options: "i" } }, // Search within city field
                        { "location.state": { $regex: searchQuery, $options: "i" } }, // Search within state field
                        { "location.country": { $regex: searchQuery, $options: "i" } }, // Search within country field
                        { "salary_range.min": { $regex: searchQuery, $options: "i" } }, // Search in min salary range
                        { "salary_range.max": { $regex: searchQuery, $options: "i" } }, // Search in max salary range
                        { "salary_range.currency": { $regex: searchQuery, $options: "i" } } // Search in salary currency
                  ]
            };

            // Perform the search and apply pagination using skip and limit
            const jobs = await jobs_collection
                  .find(searchCondition)
                  // .project({
                  //       job_title: 1,
                  //       _id: 1,
                  //       vacancy: 1,
                  //       expiry_date: 1,
                  //       job_type: 1,
                  //       salary_range: 1,
                  //       company_info: 1,
                  //       url: 1,
                  // })
                  .skip(skip)
                  .limit(limit)
                  .toArray();

            // Get the total count of jobs matching the search condition (for pagination)
            const totalCount = await jobs_collection.countDocuments(searchCondition);

            // Calculate total pages
            const totalPages = Math.ceil(totalCount / limit);

            // Respond with paginated search results
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Jobs fetched successfully",
                  data: {
                        jobs,
                        pagination: {
                              page,
                              limit,
                              totalPages,
                              totalCount,
                        },
                  },
            });
      } catch (err) {
            next(err);
      }
};


const delete_job = async (req, res, next) => {
      try {
            const { job_id } = req.query;
            console.log(job_id);
            const result = await jobs_collection.deleteOne({ _id: new ObjectId(job_id) });
            if (result.deletedCount === 0) {
                  return res.status(404).json({
                        status_code: 404,
                        error: true,
                        message: "Job not found",
                  });
            }
            res.status(200).json({
                  status_code: 200,
                  error: false,
                  message: "Job deleted successfully",
            });
      } catch (err) {
            next(err);
      }
};

const get_workspace_jobs = async (req, res, next) => {
      try {
            const { workspace_id } = req.query;
            const page = parseInt(req.query.page) || 1; // Get the current page from query, default to 1
            const limit = parseInt(req.query.limit) || 10; // Get the limit per page from query, default to 10
            const skip = (page - 1) * limit; // Calculate the number of items to skip for pagination
            const jobs = await jobs_collection.find({
                  "company_info.company_id": workspace_id
            })
                  //       .project({
                  //       job_title: 1,
                  //       _id: 1,
                  //       vacancy: 1,
                  //       expiry_date: 1,
                  //       job_type: 1,
                  //       salary_range: 1,
                  //       company_info: 1,
                  //       url: 1,
                  // })
                  .skip(skip)
                  .limit(limit)
                  .toArray();

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Jobs fetched successfully",
                  data: jobs,
            });
      } catch (err) {
            next(err);
      }
};

module.exports = { get_all_jobs, get_job_search_result, update_job, create_job, delete_job, get_workspace_jobs };
