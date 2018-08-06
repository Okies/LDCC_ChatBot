var mysql = require('mysql');
var config = require('../db/db_info').real;

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database
      });
    },
    test_open: function (con) {
      con.connect(function (err) {
        if (err) {
          console.error('mysql connection error :' + err);
        } else {
          console.info('mysql is connected successfully.');
        }
      });
    },
    createUserContext: function(key, con) {
      var sql = 'INSERT INTO user_info (u_key, u_name, u_phone, u_password) VALUES (?)';
      var values = [key, '', '', ''];

      con.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("user context inserted: " + result.affectedRows, result.insertId);
      });
    },
  }
};
