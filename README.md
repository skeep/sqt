# sqt
SQL Query Template

Given you have a sql file at `./q/users.sql`

```sql
SELECT {{x}}+{{y}} as solution
```

You could run the query from your server code as follows

```javascript
const Hapi       = require('hapi'),
      server     = new Hapi.Server(),
      mysql      = require('mysql'),
      connection = mysql.createConnection({
        host    : 'localhost',
        user    : 'root',
        password: '',
        database: 'test'
      });

connection.connect();
server.connection({port: 3000});
const sqt = require('sqt');
  server.route({
    method : 'GET',
    path   : '/canary',
    handler: function (request, reply) {
      var files       = 'q/mul',
          queryParams = {x: 5, y: 10},
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
```

Multiple queries can also be provided as below.

```javascript
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
```
