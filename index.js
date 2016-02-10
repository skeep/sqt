'use strict';
/**
 * SQL Query Template
 * @param file relative path to the sql file
 * @param conn MySQL Connection Object
 * @param queryParams Object to be passed on to handlebar template
 * @param cb Callback method to be invoked after the query returns result.
 */
module.exports = function sqt(file, conn, queryParams, cb) {
  var fs = require('fs');
  var HB = require('handlebars');

  if (!(typeof file === 'String')) {
    if (file.slice(-4) !== '.sql') {
      file = file + ".sql";
    }
  }
  var queryTemplate    = fs.readFileSync(file).toString();
  var compiledTemplate = HB.compile(queryTemplate);
  var query            = compiledTemplate(queryParams);
  conn.query(query, function (err, rows) {
    if (err) throw err;
    cb(rows);
  });
};
