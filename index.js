'use strict';
module.exports = function mysqlfetch(file, conn, queryParams, cb) {
  var fs = require('fs');
  var HB = require('handlebars');

  if (!(typeof file === 'String')) {
    if (file.slice(-4) !== '.sql') {
      file = `${file}.sql`;
    }
  }
  var queryTemplate    = fs.readFileSync(file).toString();
  var compiledTemplate = HB.compile(queryTemplate);
  var query            = compiledTemplate(queryParams);
  conn.query(query, function (err, rows) {
    if (err) throw err;
    cb(rows);
  });
}

