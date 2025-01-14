const { ObjectId } = require("mongodb");
const { category_collection, mega_category_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");


const get_category = async (req, res, next) => {
      try {
            const categories = await category_collection.find().toArray();

            // Use Promise.all to handle asynchronous operations within map
            const data = await Promise.all(
                  categories.map(async category => {
                        const mega_category = await mega_category_collection.findOne({
                              _id: new ObjectId(category.mega_category),
                        });

                        return {
                              ...category,
                              mega_category_name: mega_category ? mega_category.name : null,
                        };
                  })
            );

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Categories fetched successfully",
                  data: data,
            });
      } catch (error) {
            console.error("Error fetching categories:", error);
            next({
                  status_code: 500,
                  error: true,
                  message: "Failed to fetch categories",
            });
      }
};



const create_category = async (req, res, next) => {
      try {
            const category_data = req.body;
            category_data.created_at = new Date();
            category_data.updated_at = new Date();
            category_data.status = true;
            await category_collection.insertOne(category_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Category created successfully",
                  data: category_data,
            });
      } catch (error) {
            next(error);
      }
}

const update_category = async (req, res, next) => {
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
            const result = await category_collection.updateOne(
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


const delete_category = async (req, res, next) => {
      try {
            const { category_id } = req.query;
            await category_collection.deleteOne({ _id: new ObjectId(category_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Category deleted successfully",
            });
      } catch (error) {
            next(error);
      }
}

const get_mega_category = async (req, res, next) => {
      try {
            const categories = await mega_category_collection.find().toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Categories fetched successfully",
                  data: categories,
            });
      } catch (error) {
            next(error);
      }

}


module.exports = { get_category, create_category, update_category, delete_category, get_mega_category };
