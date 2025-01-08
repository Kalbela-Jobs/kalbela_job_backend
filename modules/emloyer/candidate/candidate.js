const { jobs_collection } = require("../../../collection/collections/system");
const { apply_jobs_collection } = require("../../../collection/collections/users_activity");

const get_all_candidates = async (req, res, next) => {
      try {
            const query = { company_id: req.query.company_id };

            // Fetch candidates who applied for jobs
            const candidates = await apply_jobs_collection.find(query).sort({ created_at: -1 }).toArray();

            // Fetch job details for the corresponding job slugs
            const job_slugs = candidates.map((candidate) => candidate.job_slug);
            const job_details = await jobs_collection.find({ url: { $in: job_slugs } }).toArray();

            // Map the job titles to the candidates
            const candidates_with_job_titles = candidates.map((candidate) => {
                  const job = job_details.find((job) => job.url === candidate.job_slug);

                  return {
                        candidate_data: candidate, // Include all candidate data here
                        jobs: {
                              title: job ? job.job_title : "Unknown Job", // Handle missing job title
                        },
                  };
            });

            // Send the response
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Candidates fetched successfully",
                  data: candidates_with_job_titles,
            });
      } catch (error) {
            next(error);
      }
};

module.exports = {
      get_all_candidates,
};
