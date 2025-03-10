const { ObjectId } = require("mongodb");
const { user_collection } = require("../../collection/collections/auth");
const { response_sender } = require("../hooks/respose_sender");

const verifyJWT = async (req, res, next) => {
      const token = req.query.token;

      if (!token) {
            return response_sender({
                  res,
                  status_code: 400,
                  error: true,
                  message: "Please provide your key",
            });
      } else {
            try {
                  const userIdQuery = { _id: new ObjectId(token) };
                  const findUser = await user_collection.findOne(userIdQuery);
                  if (findUser) {
                        next();
                  } else {
                        return response_sender({
                              res,
                              status_code: 400,
                              error: true,
                              message: "Your key is invalid",
                        });
                  }
            } catch (error) {
                  return response_sender({
                        res,
                        status_code: 500,
                        error: true,
                        message: "Internal Server Error",
                  });
            }
      }
};

const verifyAdmin = async (req, res, next) => {
      const token = req.query.token;

      if (!token) {
            return response_sender({
                  res,
                  status_code: 400,
                  error: true,
                  message: "Please provide your key",
            });
      } else {
            try {
                  const userIdQuery = { _id: new ObjectId(token) };
                  const findUser = await user_collection.findOne(userIdQuery, { role: "super_admin" });
                  if (findUser) {
                        next();
                  } else {
                        return response_sender({
                              res,
                              status_code: 400,
                              error: true,
                              message: "Your key is invalid",
                        });
                  }
            } catch (error) {
                  return response_sender({
                        res,
                        status_code: 500,
                        error: true,
                        message: "Internal Server Error",
                  });
            }
      }
};

module.exports = { verifyJWT, verifyAdmin };
