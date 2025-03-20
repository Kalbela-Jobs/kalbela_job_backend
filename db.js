
const mysql = require("mysql2");

const pool = mysql.createPool({
      host: "199.188.205.60",
      user: "dshostt_info",
      password: "Info@123@#$",
      database: "dshostt_kalbela_jobs",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
});

module.exports = pool.promise();
