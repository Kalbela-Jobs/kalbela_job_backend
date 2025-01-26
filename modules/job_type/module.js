const { ObjectId } = require("mongodb");
const { job_type_collection, jobs_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");

const create_job_type = async (req, res, next) => {
      try {
            const job_type_data = req.body;
            job_type_data.created_at = new Date();
            job_type_data.updated_at = new Date();
            job_type_data.status = true;
            await job_type_collection.insertOne(job_type_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job type created successfully",
                  data: job_type_data,
            });
      } catch (error) {
            next(error);
      }
}

const get_all_jobs = async (req, res, next) => {
      try {
            // Step 1: Fetch all job types
            const jobTypes = await job_type_collection.find().toArray();

            // Step 2: Count the number of jobs for each job type concurrently
            const result = await Promise.all(
                  jobTypes.map(async (jobType) => {
                        // Fetch the count of jobs with this job type
                        const jobCount = await jobs_collection.countDocuments({
                              job_type: jobType.name.toString(),  // Match job type ID
                        });

                        return {
                              ...jobType,
                              count: jobCount,
                        };
                  })
            );

            // Step 3: Sort the result by job count in descending order
            result.sort((a, b) => b.count - a.count);

            // Step 4: Send the response
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Jobs fetched successfully",
                  data: result,
            });
      } catch (error) {
            console.error("Error fetching jobs:", error);
            next(error); // Pass errors to the error-handling middleware
      }
};





const update_job_type = async (req, res, next) => {
      try {
            const category_data = req.body;

            if (!category_data._id) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Category ID is required",
                  });
            }

            const { ...updateFields } = category_data;

            const _id = updateFields._id;


            updateFields.updated_at = new Date();

            delete updateFields._id;

            // Ensure there's something to update
            if (Object.keys(updateFields).length === 0) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "No fields to update",
                  });
            }

            // Perform the update
            const result = await job_type_collection.updateOne(
                  { _id: new ObjectId(_id) },
                  { $set: updateFields }
            );

            if (result.matchedCount === 0) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Category not found",
                  });
            }

            // Respond with success
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Category updated successfully",
                  data: { _id, ...updateFields },
            });
      } catch (error) {
            next(error); // Pass the error to the global error handler
      }
};

const delete_job_type = async (req, res, next) => {
      try {
            const { job_type_id } = req.params;
            await job_type_collection.deleteOne({ _id: new ObjectId(job_type_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job type deleted successfully",
            });
      } catch (error) {
            next(error);
      }
}

module.exports = { create_job_type, get_all_jobs, update_job_type, delete_job_type }
