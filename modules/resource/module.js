const { ObjectId } = require("mongodb")
const { resource_collection } = require("../../collection/collections/content")
const { response_sender } = require("../hooks/respose_sender")
const { resource_category_collection } = require("../../collection/collections/system")

const create_resource = async (req, res, next) => {
      try {
            const data = req.body
            const create_data = await resource_collection.insertOne(data)
            const find_resource = await resource_collection.findOne({ _id: new ObjectId(create_data.insertedId) })
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Create new resource successful",
                  data: find_resource,
            })

      } catch (error) {
            next(error)
      }
}

const get_resource = async (req, res, next) => {
      try {
            // Extract page and limit from query parameters, with defaults
            const page = parseInt(req.query.page) || 1; // Default page is 1
            const limit = parseInt(req.query.limit) || 10; // Default limit is 10
            const skip = (page - 1) * limit;

            // Fetch resources with pagination
            const resources = await resource_collection
                  .find({})
                  .skip(skip)
                  .limit(limit)
                  .toArray();

            // Get the total count of documents for calculating total pages
            const total_count = await resource_collection.countDocuments();
            const total_pages = Math.ceil(total_count / limit);

            // Send response
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched resources successfully",
                  data: {
                        resources,
                        pagination: {
                              total_count,
                              total_pages,
                              current_page: page,
                              limit,
                        },
                  },
            });
      } catch (error) {
            next(error);
      }
};

const get_single = async (req, res, next) => {
      try {
            const { id } = req.query;
            const resource = await resource_collection.findOne({ _id: new ObjectId(id) });

            if (!resource) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Resource not found",
                        data: null,
                  });
            }

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched resource successfully",
                  data: resource,
            });
      } catch (error) {
            next(error);
      }
};

const get_search = async (req, res, next) => {
      try {
            const { query } = req.query; // Get search query
            const regex = new RegExp(query, "i"); // Case-insensitive regex

            const resources = await resource_collection
                  .find({ $or: [{ name: regex }, { description: regex }] }) // Adjust fields to match your schema
                  .toArray();

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Search results fetched successfully",
                  data: resources,
            });
      } catch (error) {
            next(error);
      }
};

const update_resource = async (req, res, next) => {
      try {
            const { id } = req.params;
            const update_data = req.body;

            const updated = await resource_collection.updateOne(
                  { _id: new ObjectId(id) },
                  { $set: update_data }
            );

            if (updated.matchedCount === 0) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Resource not found",
                        data: null,
                  });
            }

            const updated_resource = await resource_collection.findOne({ _id: new ObjectId(id) });

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Resource updated successfully",
                  data: updated_resource,
            });
      } catch (error) {
            next(error);
      }
};

const delete_resource = async (req, res, next) => {
      try {
            const { id } = req.query;

            const deleted = await resource_collection.deleteOne({ _id: new ObjectId(id) });

            if (deleted.deletedCount === 0) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Resource not found",
                        data: null,
                  });
            }

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Resource deleted successfully",
                  data: { id },
            });
      } catch (error) {
            next(error);
      }
};


const get_resource_category = async (req, res, next) => {
      try {
            const resources = await resource_category_collection.find({}).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched resources successfully",
                  data: resources,
            });
      } catch (error) {
            next(error);
      }
};

const get_resource_by_category = async (req, res, next) => {
      try {
            const { slag } = req.query;
            const resources = await resource_collection.find({
                  slag: slag
            }).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched resources successfully",
                  data: resources,
            });
      } catch (error) {
            next(error);
      }
};



module.exports = { create_resource, get_resource, get_single, get_search, update_resource, delete_resource, get_resource_category, get_resource_by_category };
