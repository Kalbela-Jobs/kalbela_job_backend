const { ObjectId } = require("mongodb");
const { jobs_collection, search_history_collection, workspace_collection, category_collection } = require("../../collection/collections/system");
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


            const jobs = await jobs_collection.find({},
                  {
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
                        },
                  })
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
            const searchQuery = req?.query?.search?.toLowerCase() || "";
            const category = req?.query?.category
            const location = req?.query?.location
            const job_type = req?.query?.job_type
            const salary_range = req?.query?.salary_range

            const page = parseInt(req?.query?.page) || 1;
            const limit = parseInt(req?.query?.limit) || 10;
            const skip = (page - 1) * limit;

            const searchCondition = { $or: [] };



            if (category?.length) {
                  const get_category_id = await category_collection.findOne({ slag: category })
                  searchCondition.$or.push({ category: { $regex: get_category_id?._id.toString(), $options: "i" } });
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
                  const searchWords = searchQuery.split(" "); // Split the query by spaces
                  searchWords.forEach((word) => {
                        const wordRegex = { $regex: word, $options: "i" }; // Create regex for each word
                        searchCondition.$or.push({ title: wordRegex });
                        searchCondition.$or.push({ url: wordRegex });
                        searchCondition.$or.push({ _id: wordRegex });
                        searchCondition.$or.push({ job_type: wordRegex });
                        searchCondition.$or.push({ category: wordRegex });
                        searchCondition.$or.push({ description: wordRegex });
                        searchCondition.$or.push({ requirements: wordRegex });
                        searchCondition.$or.push({ skills: wordRegex });
                        searchCondition.$or.push({ tags: wordRegex });
                        searchCondition.$or.push({ benefits: wordRegex });
                        searchCondition.$or.push({ company_size: wordRegex });
                        searchCondition.$or.push({ experience_level: wordRegex });
                        searchCondition.$or.push({ location: wordRegex });
                        searchCondition.$or.push({ "location.city": wordRegex });
                        searchCondition.$or.push({ "location.state": wordRegex });
                        searchCondition.$or.push({ "location.country": wordRegex });
                        searchCondition.$or.push({ "salary_range.min": wordRegex });
                        searchCondition.$or.push({ "salary_range.max": wordRegex });
                        searchCondition.$or.push({ "salary_range.currency": wordRegex });
                  });
            }

            else if (!searchQuery.length && !category?.length && !location?.length && !job_type?.length && !salary_range?.length) {
                  const wordRegex = 'a'; // Create regex for each word
                  searchCondition.$or.push({ title: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ url: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ _id: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ job_type: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ category: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ description: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ requirements: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ skills: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ tags: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ benefits: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ company_size: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ experience_level: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ location: { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ "location.city": { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ "location.state": { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ "location.country": { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ "salary_range.min": { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ "salary_range.max": { $regex: wordRegex, $options: "i" } });
                  searchCondition.$or.push({ "salary_range.currency": { $regex: wordRegex, $options: "i" } });

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

const org_all_jobs_with_info = async (req, res, next) => {
      try {
            const company_website = req.query.slug
            console.log('company_website', company_website);
            const company_info = await workspace_collection.findOne({ company_website: company_website });

            console.log('company_info', company_info);
            delete company_info.package
            delete company_info.staff
            delete company_info.priority
            delete company_info.status
            delete company_info.priority
            const jobs = await jobs_collection
                  .find(
                        { "company_info.company_id": company_info._id.toString() },
                        {
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
                              },
                        }
                  )
                  .toArray();

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Jobs fetched successfully",
                  data: { jobs, company_info }
            });

      } catch (error) {
            next(error);
      }
}

const get_featured_jobs = async (req, res, next) => {
      try {
            const jobs = await jobs_collection.find({ feature_status: true }, {
                  projection: {
                        job_title: 1,
                        job_type: 1,
                        experience_level: 1,
                        location: 1,
                        expiry_date: 1,
                        company_info: {
                              name: 1,
                              logo: 1,

                        },
                        url: 1,
                  }
            }).toArray();
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

module.exports = { get_all_jobs, get_job_search_result, update_job, create_job, delete_job, get_workspace_jobs, get_search_suggestions, get_job_info_by_id, org_all_jobs_with_info, get_featured_jobs };
