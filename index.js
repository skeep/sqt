'use strict';
/**
 * SQL Query Template
 * @param file relative path to the sql file
 * @param conn MySQL Connection Object
 * @param queryParams Object to be passed on to handlebar template
 * @param cb Callback method to be invoked after the query returns result.
 */
module.exports = function sqt(conn, files, queryParams, cb) {
  var fs    = require('fs');
  var HB    = require('handlebars');
  var Q     = require('q');
  var _     = require('lodash');
  var chalk = require('chalk');

  var logErrror = chalk.bold.red;

  function handleError(error) {
    error = '\u274C  [sqt] : ' + error;
    console.log(logErrror(error));
    throw  error;
  }

  /**
   *
   * @param file
   * @returns {*}
   * @private
   */
  function _addDotSQL(file) {
    if (_.isString(file)) {
      if (file.slice(-4) !== '.sql') {
        file = file + ".sql";
      }
    }
    return file;
  }

  /**
   *
   * @param file
   * @param params
   * @returns String the query string
   * @private
   */
  function _compile(file, params) {
    var queryTemplate    = fs.readFileSync(file).toString(),
        compiledTemplate = HB.compile(queryTemplate);
    return compiledTemplate(params);
  }

  /**
   *
   * @param file
   * @param params
   * @returns {*|promise}
   * @private
   */
  function _getDeferredPromise(file, params) {
    var deferred    = Q.defer(),
        queryString = _compile(file, params);
    conn.query(queryString, deferred.makeNodeResolver());
    return deferred.promise;
  }

  /**
   *
   * @param files
   * @param queryParams
   * @param isSingleQuery
   * @private
   */
  function _executeQueue(files, queryParams, isSingleQuery) {
    var queryQueue = [];
    files.forEach(function (file, index) {
      queryQueue.push(_getDeferredPromise(file, queryParams[index]));
    });
    var response = [];
    Q.allSettled(queryQueue).then(function (results) {
      _.each(results, function (res) {
        if (res.state === 'fulfilled') {
          response.push({state: res.state, data: res.value[0]});
        } else {
          response.push({state: res.state, message: res.reason});
        }
      });
      if (isSingleQuery) {
        cb(response[0]);
      } else {
        cb(response);
      }
    });
  }

  if (_.isArray(files)) {
    if (files.length > 0) {
      if (_.isArray(queryParams)) {
        if (queryParams.length === files.length) {
          var fileTypes = _.chain(files).map(function (file) {
            return (_.isString(file) && !_.isEmpty(file))
          }).uniq().value();
          if (fileTypes.length === 1 && fileTypes[0]) {
            files = _.map(files, function (file) {
              return _addDotSQL(file);
            });
            _executeQueue(files, queryParams);
          } else {
            throw 'all files are not valid';
          }
        } else {
          throw 'Query params and file list length do not match';
        }
      } else {
        throw 'Query parameters should also be an array';
      }
    } else {
      throw 'no files specified';
    }
  } else if (_.isString(files)) {
    if (_.isObject(queryParams)) {
      _executeQueue([_addDotSQL(files)], [queryParams], true);
    } else {
      throw 'Expect single query parameter as only one query is to be executed'
    }
  } else {
    handleError('Expect an [array] or "string" of file(s) but got ' + JSON.stringify(files));
  }

};
