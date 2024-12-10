const { package_collection } = require("../../collection/collections/system");
const { response_sender } = require("../hooks/respose_sender");

const create_package = async (req, res, next) => {
      try {
            const package_data = req.body;
            const find_package = await package_collection.findOne({ name: package_data.name });
            if (find_package) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        data: null,
                        message: "Package already exists.",
                  });
            }

            await package_collection.insertOne(package_data);
            return response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  data: package_data,
                  message: "Package created successfully",
            });
      } catch (error) {
            next(error);
      }
}


const get_all_packages = async (req, res, next) => {
      try {
            const packages = await package_collection.find().toArray();
            return response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  data: packages,
                  message: "Packages fetched successfully",
            });
      } catch (error) {
            next(error);
      }
}


module.exports = { create_package, get_all_packages };
