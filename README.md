# sqt
SQL Query Template

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
      let file        = './q/hb',
          queryParams = {limit: 10},
          cb          = (result) => {
            reply(result);
          };
      sqt(file, connection, queryParams, cb);
    }
  });
  
```
