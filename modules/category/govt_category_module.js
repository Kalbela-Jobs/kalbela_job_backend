const { ObjectId } = require("mongodb");
const { govt_category_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");

const create_govt_category = async (req, res, next) => {
      try {
            const category_data = req.body;
            category_data.created_at = new Date();
            category_data.updated_at = new Date();
            category_data.status = true;
            await govt_category_collection.insertOne(category_data);
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

const get_govt_category = async (req, res, next) => {
      try {
            const categories = await govt_category_collection.find().toArray();
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

const update_govt_category = async (req, res, next) => {
      try {
            const category_data = req.body;
            const query = { _id: new ObjectId(req.query.govt_category_id) };
            category_data.updated_at = new Date();
            await govt_category_collection.updateOne(
                  query,
                  { $set: category_data }
            );
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

const delete_govt_category = async (req, res, next) => {
      try {
            const query = { _id: new ObjectId(req.query.govt_category_id) };
            await govt_category_collection.deleteOne(query);
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


module.exports = { create_govt_category, get_govt_category, update_govt_category, delete_govt_category }
