'use strict';
var Hapi       = require('hapi'),
    server     = new Hapi.Server(),
    mysql      = require('mysql'),
    connection = mysql.createConnection({
      host    : 'localhost',
      user    : 'root',
      password: '',
      database: 'sakila'
    }),
    sqt        = require('../index.js');

connection.connect();
server.connection({port: 3000});

server.route({
  method : 'GET',
  path   : '/moreusers',
  handler: function (request, reply) {
    var files       = ['q/hb', 'q/hb.sql'],
        queryParams = [{limit: 1}, {limit: 2}],
        cb          = function (result) {
          reply(result);
        };
    try {
      sqt(connection, files, queryParams, cb);
    } catch (e) {
      reply(e);
    }
  }
});

server.route({
  method : 'GET',
  path   : '/users',
  handler: function (request, reply) {
    var files       = 'q/hb',
        queryParams = {limit: 5},
        cb          = function (result) {
          reply(result);
        };
    try {
      sqt(connection, files, queryParams, cb);
    } catch (e) {
      reply(e);
    }
  }
});

server.start(server.log('info', 'Server running at: ' + server.info.uri));
