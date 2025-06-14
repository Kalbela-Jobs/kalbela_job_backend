const { ObjectId } = require("mongodb");
const { user_collection } = require("../../../collection/collections/auth");
const { jobs_collection } = require("../../../collection/collections/system");
const { apply_jobs_collection, user_skill_collection, education_collection, certification_collection } = require("../../../collection/collections/users_activity");
const { response_sender } = require("../../hooks/respose_sender");

const get_all_candidates = async (req, res, next) => {
      try {
            const query = { company_id: req.query.company_id };

            let candidates = await apply_jobs_collection.find(query).sort({ created_at: -1 }).toArray();

            if (candidates.length === 0) {
                  return response_sender({
                        res,
                        status_code: 200,
                        error: false,
                        message: "No candidates found",
                        data: [],
                  });
            }

            const candidates_with_details = await Promise.all(candidates.map(async (candidate) => {

                  const user = await user_collection.findOne({ _id: new ObjectId(candidate.user_id) });
                  if (user) {
                        candidate.full_name = user?.fullName;
                        candidate.profile_image = user?.profile_picture;
                  }

                  const job = await jobs_collection.findOne({ url: candidate.job_slug });
                  if (job) {
                        candidate.job_title = job.job_title;
                  }

                  return candidate;
            }));


            // Send the response
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Candidates fetched successfully",
                  data: candidates_with_details,
            });
      } catch (error) {
            next(error);
      }
};

const get_single_candidate = async (req, res, next) => {
      try {
            const { candidate_id } = req.query;

            if (
                  candidate_id == null ||
                  candidate_id == undefined
            ) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Candidate id not found",
                        data: null,
                  });
            }

            let candidate = await apply_jobs_collection.findOne({ _id: new ObjectId(candidate_id) });
            if (candidate && candidate.status === "Applied") {
                  await apply_jobs_collection.updateOne({ _id: new ObjectId(candidate_id) }, { $set: { status: "Review" } })
            }
            const user = await user_collection.findOne({ _id: new ObjectId(candidate.user_id) });
            if (user) {
                  candidate.user = user;
                  delete candidate.user.password;
                  delete candidate.user.role;
                  delete candidate.user._id;
                  delete candidate.user.preferences;
                  delete candidate.user.payment_id;
            }
            const skill = await user_skill_collection.findOne({
                  user_id: candidate.user_id,
            });
            if (skill) {
                  candidate.skills = skill.skills;
            }
            const education = await education_collection.find({ user_id: candidate.user_id }, {
                  projection: {
                        _id: 0,
                        id: 0,
                        user_id: 0,
                        created_at: 0,
                        updated_at: 0
                  }
            }).toArray();
            if (education) {
                  candidate.education = education;
            }
            const certification = await certification_collection.findOne({
                  user_id: candidate.user_id,
            });
            if (certification) {
                  candidate.certifications = certification.certifications;
            }
            if (!candidate) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Candidate not found",
                        data: null,
                  });
            }


            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Candidate fetched successfully",
                  data: candidate,
            });
      } catch (error) {
            next(error);
      }
};

const update_candidate_status = async (req, res, next) => {
      try {
            const { candidate_id } = req.query;
            await apply_jobs_collection.updateOne({ _id: new ObjectId(candidate_id) }, { $set: { ...req.body } });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Candidate status updated successfully",
                  data: null,
            });
      } catch (error) {
            next(error);
      }
};

const get_candidate_by_job = async (req, res, next) => {
      try {
            const { job_slug, page = 1, limit = 10, search = "" } = req.query;


            // Convert page and limit to numbers
            const pageNumber = parseInt(page);
            const limitNumber = parseInt(limit);
            const skip = (pageNumber - 1) * limitNumber;

            // Build the filter query
            const query = { job_slug };


            if (search) {
                  query.$or = [
                        { name: { $regex: search, $options: "i" } }, // Search by name (case-insensitive)
                        { email: { $regex: search, $options: "i" } } // Search by email (if applicable)
                  ];
            }

            // Fetch candidates with pagination
            const candidates = await apply_jobs_collection
                  .find(query)
                  .skip(skip)
                  .limit(limitNumber)
                  .toArray();

            // Get total count for pagination
            const totalCandidates = await apply_jobs_collection.countDocuments(query);
          

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Candidates fetched successfully",
                  data: {
                        candidates,
                        pagination: {
                              total: totalCandidates,
                              page: pageNumber,
                              limit: limitNumber,
                              totalPages: Math.ceil(totalCandidates / limitNumber),
                        },
                  },
            });

      } catch (error) {
            next(error);
      }
};


module.exports = {
      get_all_candidates,
      get_single_candidate,
      update_candidate_status,
      get_candidate_by_job
};
