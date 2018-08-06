var express = require('express');
var router = express.Router();
var { basic } = require('../scenario/message');
var flow = require('../scenario/flow');
var mysql_dbc = require('../db/db_con')();

router.get('/keyboard', (req, res) => {
  res.json(basic);
});

router.post('/message', (req, res) => {
  //console.log(req.body);
  //{ user_key: 'XOvDQdgCTUaq', type: 'text', content: '버튼1' }
  var {user_key, content} = req.body;
  console.log(user_key, content);

  //mysql
  var connection = mysql_dbc.init();
  mysql_dbc.test_open(connection);
  // var val = mysql_dbc.getContext(connection, user_key);
  // console.log("VAL: ", val);

  var sql = 'SELECT u_index, u_name, u_phone, u_password FROM user_info';
  sql = sql + " where u_key='" + user_key + "'";
  console.log("SQL : ", sql);
  connection.query(sql, (err, result, field) => {
    //console.log("RESULT: ", result[0]);

    go(result[0],
      value => flow(user_key, content, value),
      msg => res.json(msg));
  });


});

module.exports = router;
