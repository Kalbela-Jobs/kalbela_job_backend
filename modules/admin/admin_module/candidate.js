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

module.exports = { get_all_candidates };
