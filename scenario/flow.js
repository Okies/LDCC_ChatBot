var message = require('./message');
var mysql_dbc = require('../db/db_con')();

var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

module.exports = function (key, content, context) {

  var defaultContext = {
    u_index: 'start',
    u_name: null,
    u_phone: null,
    u_password: null
  };

  function setContext(context, msg) {
    context["u_" + context.u_index] = msg;
    return context;
  };

  function insertContext(key) {
    mysql_dbc.createUserContext(key, connection);
    return defaultContext;
  }

  function contextCheck(context) {
    console.log(context, "contextCheck");
    return context == null ? insertContext(key) : setContextBranch(context, content);
  };

  function setContextBranch (context, msg) {
    console.log(context, msg, "setContextBranch");
    return go(context,
    match
    .case({u_index: 'name'})(c => setContext(c, msg))
    .case({u_index: 'phone'})(c => setContext(c, msg))
    .case({u_index: 'password'})(c => setContext(c, msg))
    .else(c => c)
    );
  };

  //위까지가 Context 설정
  //아래는 Branch 설정

  function completeCheck(context) {
    console.log(context, "completeCheck");
    return every(c => c, context);
  };

  function loginCheck(context, msg) {
    console.log(context.u_index, msg, "loginCheck");
    var forCheck = context.u_index.slice(6);
    console.log(forCheck, "loginCheck");
    return context["u_" + forCheck] == msg;
  }

  function nextBranch(context, msg) {
    console.log(context, msg, "nextBranch");
    return go(context,
    match
    .case({u_index: 'start'})(c => startBranch(c, msg))
    .case({u_index: 'name'})(c => completeCheck(c) ? 'confirm' : 'phone')
    .case({u_index: 'phone'})(c => completeCheck(c) ? 'confirm' : 'password')
    .case({u_index: 'login_phone'})(c => loginCheck(c, msg) ? 'login_password' : 'fail_phone')
    .case({u_index: 'login_password'})(c => loginCheck(c, msg) ? 'show' : 'fail_password')
    .case({u_index: 'fail_phone'})(_ => failBranch(msg) ? 'login_phone' : 'start')
    .case({u_index: 'fail_password'})(_ => failBranch(msg) ? 'login_password' : 'start')
    .case({u_index: 'confirm'})(_ => confirmBranch(msg))
    .case({u_index: 'show'})(c => startBranch(c, msg))
    .case({u_index: 'reset'})(_ => confirmResetBranch(msg))
    .else(_ => 'start')
    );
  };

  function historyCheck(context) {
    console.log(context, "historyCheck");
    return completeCheck(context) ? true : false;
  };

  function failBranch(msg) {
    switch(msg) {
      case '다시입력' : return true;
      case '처음으로' : return false;
    }
  }

  function startBranch(context, msg) {
    console.log(context, msg, "startBranch");
    switch(msg) {
      case '등록하기': return historyCheck(context) ? 'reset' : 'name';
      case '내 정보': return completeCheck(context) ? 'login_phone' : 'start';
      default : return 'start';
    }
  };

  function confirmResetBranch(msg) {
    console.log(msg, "confirmResetBranch");
    switch(msg) {
      case '네': return 'name';
      case '아니오': return 'start';
    }
  }

  function resetCheck(context, ...arr) {
    console.log(context, arr, "resetCheck"); //[undefined, 네] 들어옴 수정해야됨
    return isMatch(['reset', '네'], arr) ? defaultContext : context;
  }

  function updateContext(context, u_index) {
    console.log(context, u_index, "updqteContext");

    var newContext = resetCheck(context, context.u_index, content);
    newContext.u_index = u_index;

    console.log(newContext, "updqteContext");

    var sql = "UPDATE user_info set u_index=?, u_name=?, u_phone=?, u_password=? ";
    sql = sql + "where u_key='" + key + "'";
    console.log("SQL : ", sql);
    val = [];
    for(var k of Object.keys(newContext)) {
      val.push(newContext[k]);
    }
    console.log("val : ", val);

    connection.query(sql, val, (err, result) => {
      console.log("userContext updated!!!!");
      console.log(result);
    });

    return newContext;
  };

  function messageFunction (context, index) {
    console.log(context, index, "messageFunction");
    return index === 'confirm' ? message.confirm(context) : message.show(context, key);
  };

  function nextMessage (context) {
    console.log(context, "nextMessage");
    const { u_index } = context;
    return ['confirm', 'show'].includes(u_index) ? messageFunction(context, u_index) : message[u_index];
  };

  return go(
    context,
    contextCheck,
    c => updateContext(c, nextBranch(c, content)),
    nextMessage
  );
};
