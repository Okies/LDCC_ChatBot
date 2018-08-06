module.exports = (function () {
  return {
    local: { // localhost
      host: 'localhost',
      port: '3306',
      user: 'test',
      password: 'test1234!@#$',
      database: 'testdb'
    },
    real: { // real server db info
      host: '13.209.205.115',
      port: '3306',
      user: 'root',
      password: '1234',
      database: 'testdb'
    },
    dev: { // dev server db info
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    }
  }
})();
