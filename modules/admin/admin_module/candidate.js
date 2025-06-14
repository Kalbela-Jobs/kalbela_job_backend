const { ObjectId } = require("mongodb");
const { user_collection } = require("../../../collection/collections/auth");
const { response_sender } = require("../../hooks/respose_sender");

const get_all_candidates = async (req, res, next) => {
      try {
            const { page = 1, limit = 10, search = "" } = req.query;

            const currentPage = Math.max(parseInt(page, 10), 1);
            const pageSize = Math.max(parseInt(limit, 10), 1);

            // Construct search query with case-insensitive regex for flexibility
            const query = {
                  role: "job_sucker",
                  ...(search && {
                        $or: [
                              { fullName: { $regex: search, $options: "i" } },
                              { email: { $regex: search, $options: "i" } },
                              { phone: { $regex: search, $options: "i" } }
                        ]
                  }),
            };

            // Fetch total count
            const total_candidates = await user_collection.countDocuments(query);

            // Fetch paginated results
            const candidates = await user_collection
                  .find(query)
                  .skip((currentPage - 1) * pageSize)
                  .limit(pageSize)
                  .toArray();

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Candidates fetched successfully",
                  data: {
                        total: total_candidates,
                        page: currentPage,
                        limit: pageSize,
                        candidates,
                  },
            });

      } catch (error) {
            next(error);
      }
};

const update_candidate_info = async (req, res, next) => {
      try {
            const { candidate_id } = req.query;
            const data = req.body;
            await user_collection.updateOne({ _id: new ObjectId(candidate_id) },
                  {
                        $set: {
                              ...data,
                              updated_at: new Date(),
                        }
                  });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Candidate info updated successfully",
            });
      } catch (error) {
            next(error);
      }
}

const delete_candidate = async (req, res, next) => {
      try {
            const { candidate_id } = req.query;
            await user_collection.deleteOne({ _id: new ObjectId(candidate_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Candidate deleted successfully",
            });
      } catch (error) {
            next(error);
      }
}

module.exports = { get_all_candidates, update_candidate_info, delete_candidate };
