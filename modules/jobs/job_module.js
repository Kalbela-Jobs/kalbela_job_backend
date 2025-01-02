const { ObjectId } = require("mongodb");
const { jobs_collection, search_history_collection } = require("../../collection/collections/system");
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
            const { job_id } = req.query;
            const updates = req.body;
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

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;


            const jobs = await jobs_collection.find({})
                  .skip(skip)
                  .limit(limit)
                  .toArray();

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


const get_job_search_result = async (req, res, next) => {
      console.log("get_job_search_result", req.query);
      try {
            const searchQuery = req.query.search || "";
            const category = req.query.category
            const location = req.query.location
            const job_type = req.query.job_type
            const salary_range = req.query.salary_range

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const searchCondition = { $or: [] };



            if (category?.length) {
                  console.log('hit');
                  searchCondition.$or.push({ category: { $regex: category, $options: "i" } });
            }
            if (location?.length) {
                  console.log('hit1');
                  searchCondition.$or.push({ location: { $regex: location, $options: "i" } });
            }
            if (job_type?.length) {
                  console.log('hit2');
                  searchCondition.$or.push({ job_type: { $regex: job_type, $options: "i" } });
            }
            if (salary_range?.length) {
                  console.log('hit3');
                  searchCondition.$or.push({ "salary_range.min": { $regex: salary_range, $options: "i" } });
                  searchCondition.$or.push({ "salary_range.max": { $regex: salary_range, $options: "i" } });
                  searchCondition.$or.push({ "salary_range.currency": { $regex: salary_range, $options: "i" } });
            }

            else if (searchQuery.length) {
                  console.log('hit4');
                  searchCondition.$or.push({ title: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ _id: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ job_type: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ category: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ description: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ requirements: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ skills: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ tags: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ benefits: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ company_size: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ experience_level: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ location: { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ "location.city": { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ "location.state": { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ "location.country": { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ "salary_range.min": { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ "salary_range.max": { $regex: searchQuery, $options: "i" } });
                  searchCondition.$or.push({ "salary_range.currency": { $regex: searchQuery, $options: "i" } });
            }


            const jobs = await jobs_collection
                  .find(searchCondition)
                  .skip(skip)
                  .limit(limit)
                  .toArray();


            const totalCount = await jobs_collection.countDocuments(searchCondition);
            const totalPages = Math.ceil(totalCount / limit);


            if (searchQuery.length) {
                  const existingTerm = await search_history_collection.findOne({ search: searchQuery });

                  if (!existingTerm) {
                        await search_history_collection.insertOne({ search: searchQuery, timestamp: new Date() });
                  }
            }
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

const get_search_suggestions = async (req, res) => {
      try {
            const search = req.query.search;

            // MongoDB query with regex for case-insensitive matching
            const query = {
                  search: { $regex: search, $options: "i" },
            };

            // Retrieve suggestions from the collection
            const suggestions = await search_history_collection
                  .find(query)
                  .sort({ timestamp: -1 })
                  .limit(20) // Fetch more to filter duplicates
                  .toArray();

            // Remove duplicates by `term`
            const uniqueSuggestions = [];
            const termSet = new Set();

            for (const suggestion of suggestions) {
                  if (!termSet.has(suggestion.search)) {
                        termSet.add(suggestion.search);
                        uniqueSuggestions.push(suggestion);
                  }
            }

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Suggestions fetched successfully",
                  data: uniqueSuggestions.slice(0, 5), // Limit to top 5 unique results
            });
      } catch (error) {
            response_sender({
                  res,
                  status_code: 500,
                  error: true,
                  message: "An error occurred while fetching suggestions",
            });
      }
};


const get_job_info_by_id = async (req, res, next) => {
      const url = req.query.url
      const find_job = await jobs_collection.findOne({ url })
      if (find_job) {
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Jobs fetched successfully",
                  data: find_job
            })
      }
}


module.exports = { get_all_jobs, get_job_search_result, update_job, create_job, delete_job, get_workspace_jobs, get_search_suggestions, get_job_info_by_id };
