# sqt
SQL Query Template

Given you have a sql file at `./q/users.sql`

```sql
SELECT * FROM customer LIMIT {{limit}}
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
        database: 'sakila'
      });

connection.connect();
server.connection({port: 3000});
const sqt = require('sqt');
  server.route({
    method : 'GET',
    path   : '/users',
    handler: (request, reply) => {
      let file        = './q/users',
          queryParams = {limit: 10},
          cb          = (result) => {
            reply(result);
          };
      // execute the query and return the result to browser    
      sqt(file, connection, queryParams, cb);
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
