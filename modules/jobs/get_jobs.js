
const { jobs_collection, category_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");

const new_jobs = async (req, res, next) => {
      try {
            const page = parseInt(req.query.page) || 1; // Default to page 1
            const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page
            const skip = (page - 1) * limit;

            const get_new_jobs = await jobs_collection.find({
                  status: true,
                  created_at: { $lte: new Date() } // Jobs created up to now (not future)
            })
                  .skip(skip)
                  .limit(limit)
                  .sort({ created_at: -1 }) // Optional: Sort newest first
                  .toArray();
            const currentDate = new Date().toISOString();

            const total_jobs = await jobs_collection.countDocuments({
                  status: true,
                  created_at: { $lte: new Date() },
                  expiry_date: { $gte: currentDate }
            });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "New jobs fetched successfully",
                  data: {
                        jobs: get_new_jobs,
                        pagination: {
                              total: total_jobs,
                              page,
                              limit,
                              totalPages: Math.ceil(total_jobs / limit)
                        }
                  }
            });
      } catch (error) {
            next(error); // Good practice: send errors to your error handler
      }
};


const earliest_deadline = async (req, res, next) => {
      try {
            const page = parseInt(req.query.page) || 1; // Default page = 1
            const limit = parseInt(req.query.limit) || 10; // Default limit = 10
            const skip = (page - 1) * limit;
            const currentDate = new Date().toISOString();

            const jobs = await jobs_collection.find({
                  status: true,
                  expiry_date: { $exists: true },
                  expiry_date: { $gte: currentDate }
            })
                  .sort({ expiry_date: 1 })
                  .skip(skip)
                  .limit(limit)
                  .toArray();

            const total_jobs = await jobs_collection.countDocuments({
                  status: true,
                  expiry_date: { $exists: true },
                  expiry_date: { $gte: currentDate }
            });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Earliest deadline jobs fetched successfully",
                  data: {
                        jobs,
                        pagination: {
                              total: total_jobs,
                              page,
                              limit,
                              totalPages: Math.ceil(total_jobs / limit),
                              hasNextPage: skip + limit < total_jobs,
                              hasPrevPage: page > 1
                        }
                  }
            });

      } catch (error) {
            next(error);
      }
}


const internship = async (req, res, next) => {
      try {
            const page = parseInt(req.query.page) || 1; // Default page = 1
            const limit = parseInt(req.query.limit) || 10; // Default limit = 10
            const skip = (page - 1) * limit;
            const currentDate = new Date().toISOString();

            const jobs = await jobs_collection.find({
                  status: true,
                  job_type: { $in: ['internship', 'Internship'] },
                  expiry_date: { $gte: currentDate }
            })
                  .sort({ created_at: -1 }) // Newest internships first
                  .skip(skip)
                  .limit(limit)
                  .toArray();

            const total_jobs = await jobs_collection.countDocuments({
                  expiry_date: { $gte: currentDate },
                  status: true,
                  job_type: { $in: ['internship', 'Internship'] }
            });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Internship jobs fetched successfully",
                  data: {
                        jobs,
                        pagination: {
                              total: total_jobs,
                              page,
                              limit,
                              totalPages: Math.ceil(total_jobs / limit),
                              hasNextPage: skip + limit < total_jobs,
                              hasPrevPage: page > 1
                        }
                  }
            });

      } catch (error) {
            next(error);
      }
}

const skilled_jobs = async (req, res, next) => {
      try {
            const skilled_mega_category_id = "67861bad5dd8a9368083956d";

            const page_size = parseInt(req.query.page_size) || 15;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * page_size;
            const currentDate = new Date().toISOString();


            const skilled_categories = await category_collection.find({
                  mega_category: skilled_mega_category_id,
                  status: true,
            }).project({ _id: 1 }).toArray();

         

            const skilled_category_ids = skilled_categories.map(cat => cat._id.toString());

            if (skilled_category_ids.length === 0) {
                  return response_sender({
                        res,
                        status_code: 200,
                        error: false,
                        message: "No skilled categories found.",
                        data: {
                              jobs: [],
                              total_jobs: 0,
                              current_page: page,
                              total_pages: 0,
                        },
                  });
            }


            const query = {
                  category: { $in: skilled_category_ids },
                  status: true,
                  expiry_date: {
                        $gte: currentDate
                  }
            };



            const cursor = jobs_collection.find(query, {
                  projection: {
                        job_title: 1,
                        job_type: 1,
                        experience_level: 1,
                        location: 1,
                        company_info: {
                              name: 1,
                              logo: 1,
                        },
                        url: 1,
                  },
            });

            const jobs = await cursor.skip(skip).limit(page_size).toArray();
            const total_jobs = await jobs_collection.countDocuments(query);

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Skilled jobs fetched successfully",
                  data: {
                        jobs,
                        total_jobs,
                        current_page: page,
                        total_pages: Math.ceil(total_jobs / page_size),
                  },
            });
      } catch (error) {
            next(error);
      }
};



const tenders = async (req, res, next) => {

}

const worldwide_jobs = async (req, res, next) => {
      try {
            const page = parseInt(req.query.page) || 1; // Default to page 1
            const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page
            const skip = (page - 1) * limit;
            const currentDate = new Date().toISOString();

            const jobs = await jobs_collection.find({
                  status: true,
                  "location.country": { $nin: ["BD", "Bangladesh"] },
                  expiry_date: { $gte: currentDate }
            })
                  .sort({ created_at: -1 }) // Newest worldwide jobs first
                  .skip(skip)
                  .limit(limit)
                  .toArray();

            const total_jobs = await jobs_collection.countDocuments({
                  status: true,
                  expiry_date: { $gte: currentDate },
                  "location.country": { $nin: ["BD", "Bangladesh"] }
            });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Worldwide jobs fetched successfully",
                  data: {
                        jobs,
                        pagination: {
                              total: total_jobs,
                              page,
                              limit,
                              totalPages: Math.ceil(total_jobs / limit),
                              hasNextPage: skip + limit < total_jobs,
                              hasPrevPage: page > 1
                        }
                  }
            });

      } catch (error) {
            next(error);
      }
}


module.exports = {
      new_jobs,
      earliest_deadline,
      internship,
      skilled_jobs,
      worldwide_jobs,
      tenders
}
