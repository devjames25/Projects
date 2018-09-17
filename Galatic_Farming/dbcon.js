var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_jamesde',
  password        : '5667',
  database        : 'cs290_jamesde'
});

module.exports.pool = pool;
