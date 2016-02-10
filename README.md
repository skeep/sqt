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
