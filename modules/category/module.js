const { category_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");

const get_category = async (req, res, next) => {
      try {
            const categories = await category_collection.find().toArray();
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
            category_data.updated_at = new Date();
            await category_collection.updateOne({ _id: new ObjectId(category_data._id) }, { $set: category_data });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Category updated successfully",
                  data: category_data,
            });
      } catch (error) {
            next(error);
      }
}

const delete_category = async (req, res, next) => {
      try {
            const { category_id } = req.params;
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


module.exports = { get_category, create_category, update_category, delete_category };
