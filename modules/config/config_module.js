const { ObjectId } = require("mongodb");
const { skill_collection, department_collection, industry_collection, position_collection, location_collection, hero_logo_collection } = require("../../collection/collections/content");
const { response_sender } = require("../hooks/respose_sender");

const create_skill = async (req, res, next) => {
      try {
            const skill_data = req.body;
            const existing_skill = await skill_collection.findOne({
                  name: { $regex: `^${skill_data.name}$`, $options: "i" }
            });

            if (existing_skill) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Skill with the same name already exists",
                        data: null,
                  });
            }

            await skill_collection.insertOne(skill_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Skill created successfully",
                  data: skill_data,
            });
      } catch (error) {
            next(error);
      }
};

const delete_skill = async (req, res, next) => {
      try {
            const skill_id = req.query.id;
            await skill_collection.deleteOne({ _id: new ObjectId(skill_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Skill deleted successfully",
                  data: null,
            });
      } catch (error) {
            next(error);
      }
};

const add_location = async (req, res, next) => {
      try {
            const location_data = req.body;
            const existing_location = await location_collection.findOne({
                  name: { $regex: `^${location_data.name}$`, $options: "i" }
            });

            if (existing_location) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Location with the same name already exists",
                        data: null,
                  });
            }

            await location_collection.insertOne(location_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Location created successfully",
                  data: location_data,
            });
      } catch (error) {
            next(error);
      }
};

const delete_location = async (req, res, next) => {
      try {
            const location_id = req.query.id;
            await location_collection.deleteOne({ _id: new ObjectId(location_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Location deleted successfully",
                  data: null,
            });
      } catch (error) {
            next(error);
      }
};

const add_position = async (req, res, next) => {
      try {
            const position_data = req.body;
            const existing_position = await position_collection.findOne({
                  name: { $regex: `^${position_data.name}$`, $options: "i" }
            });

            if (existing_position) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Position with the same name already exists",
                        data: null,
                  });
            } await position_collection.insertOne(position_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Position created successfully",
                  data: position_data,
            });
      } catch (error) {
            next(error);
      }
}

const delete_position = async (req, res, next) => {
      try {
            const position_id = req.query.id;
            await position_collection.deleteOne({ _id: new ObjectId(position_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Position deleted successfully",
                  data: null,
            });
      } catch (error) {
            next(error);
      }
};

const add_department = async (req, res, next) => {
      try {
            const department_data = req.body;
            const existing_department = await department_collection.findOne({
                  name: { $regex: `^${department_data.name}$`, $options: "i" }
            });

            if (existing_department) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Department with the same name already exists",
                        data: null,
                  });
            } await department_collection.insertOne(department_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Department created successfully",
                  data: department_data,
            });
      } catch (error) {
            next(error);
      }
}

const delete_department = async (req, res, next) => {
      try {
            const department_id = req.query.id;
            await department_collection.deleteOne({ _id: new ObjectId(department_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Department deleted successfully",
                  data: null,
            });
      } catch (error) {
            next(error);
      }
};


const add_industry = async (req, res, next) => {
      try {
            const industry_data = req.body;
            const existing_industry = await industry_collection.findOne({
                  name: { $regex: `^${industry_data.name}$`, $options: "i" }
            });

            if (existing_industry) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Industry with the same name already exists",
                        data: null,
                  });
            } await industry_collection.insertOne(industry_data);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Industry created successfully",
                  data: industry_data,
            });
      } catch (error) {
            next(error);
      }
}

const delete_industry = async (req, res, next) => {
      try {
            const industry_id = req.query.id;
            await industry_collection.deleteOne({ _id: new ObjectId(industry_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Industry deleted successfully",
                  data: null,
            });
      } catch (error) {
            next(error);
      }
};


const get_all_skills = async (req, res, next) => {
      try {
            const skills = await skill_collection.find({}).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched skills successfully",
                  data: skills,
            });
      } catch (error) {
            next(error);
      }
};

const get_all_locations = async (req, res, next) => {
      try {
            const locations = await location_collection.find({}).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched locations successfully",
                  data: locations,
            });
      } catch (error) {
            next(error);
      }
};

const get_all_positions = async (req, res, next) => {
      try {
            const positions = await position_collection.find({}).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched positions successfully",
                  data: positions,
            });
      } catch (error) {
            next(error);
      }
};

const get_all_departments = async (req, res, next) => {
      try {
            const departments = await department_collection.find({}).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched departments successfully",
                  data: departments,
            });
      } catch (error) {
            next(error);
      }
};

const get_all_industries = async (req, res, next) => {
      try {
            const industries = await industry_collection.find({}).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched industries successfully",
                  data: industries,
            });
      } catch (error) {
            next(error);
      }
};


const add_hero_logo = async (req, res, next) => {
      try {
            const hero_logo = req.body;
            await hero_logo_collection.insertOne(hero_logo);
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Hero logo created successfully",
                  data: hero_logo,
            });
      } catch (error) {
            next(error);
      }
}

const delete_hero_logo = async (req, res, next) => {
      try {
            const hero_logo_id = req.query.id;
            await hero_logo_collection.deleteOne({ _id: new ObjectId(hero_logo_id) });
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Hero logo deleted successfully",
                  data: null,
            });
      } catch (error) {
            next(error);
      }
};

const get_hero_logo = async (req, res, next) => {
      try {
            const hero_logo = await hero_logo_collection.find({}).toArray();
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Fetched hero logo successfully",
                  data: hero_logo,
            });
      } catch (error) {
            next(error);
      }
};


module.exports = { create_skill, delete_skill, add_location, delete_location, add_position, delete_position, add_department, delete_department, add_industry, delete_industry, get_all_skills, get_all_locations, get_all_positions, get_all_departments, get_all_industries, add_hero_logo, get_hero_logo, delete_hero_logo };
