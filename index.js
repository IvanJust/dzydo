const path = require('path');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const http = require("http");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

let app;

const { Server } = require("socket.io");

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


// process.on('unhandledRejection', (error) => {
//     console.log(`Error: ${error?.message}\nStack: ${error?.stack}`);
// });

//(async () => {


app = express();

app.use(cors(corsOptions));
app.use(express.static(path.resolve(__dirname, 'dzudo-client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.SERVER_PORT;
const socket_port = process.env.SOCKET_PORT;
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const pool = new Pool()

const socketIO = new Server({
  cors: {
    origin: `http://localhost:${port}`
  }
});

socketIO.on('connection', (socket) => {
  console.log('a user connected');
});

socketIO.listen(socket_port);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post('/api/token/get', (request, response) => {
  const param = request.body;

  if (typeof param['event_id'] !== 'undefined' && typeof param['login'] !== 'undefined' && typeof param['password'] !== 'undefined') {
    pool.query('SELECT * FROM "user" JOIN "event_user_role" ON "user_id"="user"."id" WHERE "event_id"=' + param['event_id'] + ' AND "login"=' + "'" + param['login'] + "'" + ' AND "password"=' + "'" + param['password'] + "'").then(function (res) {
      if (res['rows'].length > 0) {
        const res = {
          token: jwt.sign({
            sub: res['rows']['id'],
            ext: cdate(),
            role: res['rows']['role_id'],
          }, jwtSecretKey),
          sub: res['rows']['id'],
          ext: cdate(),
          role: res['rows']['role_id'],
        }

        // response.send(jwt.sign({
        //   sub: res['rows']['id'],
        //   ext: cdate(),
        //   role: res['rows']['role_id'],
        // }, jwtSecretKey));
      }
      else {
        response.status(500).send(Error('User not found.'));
      }
    });
  }
  else {
    response.status(500).send(Error('Param undefined.'));
  }
});

app.post('/api/token/check', (request, response) => {
  try {
    const token = getTokenFromHeader(request);
    const verified = jwt.verify(token, jwtSecretKey);

    if (verified) {
      return response.send("Successfully");
    } else {
      return response.status(401).send(error);
    }
  } catch (error) {
    return response.status(401).send(error);
  }
});



app.post('/api/user/set', (request, response) => {
  const { lastname, firstname, patronymic, login, password } = request.body;
  try {
    if (!lastname || !firstname || !patronymic || !login || !password) throw "Error";

    pool.query(`INSERT INTO "user" (lastname, firstname, patronymic, login, password) VALUES ($1, $2, $3, $4, $5)`, [lastname, firstname, patronymic, login, password]);

    response.send("Готово");
  } catch (e) {
    response.send({
      status: "500",
      text: "an error occured when save user",
    });
  }
});

app.post('/api/user/get', (request, response) => {
  const param = request.body;

  sql = 'SELECT * FROM "user"';

  if (typeof param['id'] !== 'undefined') {
    sql += 'WHERE "id"=' + param['id'];
  }

  pool.query(sql).then(function (res) {
    response.send(res['rows']);
  });
});



app.post('/api/event/set', (request, response) => {
  const param = request.body;

  if (typeof param['name'] !== 'undefined' && typeof param['place'] !== 'undefined' && typeof param['date'] !== 'undefined') {
    pool.query("INSERT INTO " + '"event" ("name", "place", "date")' + " VALUES (?, ?, ?)", [param['name'], param['place'], param['date']]);
    response.send("Готово");
  }
  else {
    response.send("Error");
  }
});

app.post('/api/event/get', (request, response) => {
  const param = request.body;

  sql = 'SELECT * FROM "event"';

  if (typeof param['id'] !== 'undefined') {
    sql += 'WHERE "id"=' + param['id'];
  }

  pool.query(sql).then(function (res) {
    response.send(res['rows']);
  });
});



app.post('/api/role/set', (request, response) => {
  const param = request.body;

  if (typeof param['name'] !== 'undefined') {
    pool.query("INSERT INTO " + '"role" ("name")' + " VALUES ('" + param['name'] + "')");
    response.send("Готово");
  }
  else {
    response.send("Error");
  }
});

app.post('/api/role/get', (request, response) => {
  const param = request.body;

  sql = 'SELECT * FROM "role"';

  if (typeof param['id'] !== 'undefined') {
    sql += 'WHERE "id"=' + param['id'];
  }

  pool.query(sql).then(function (res) {
    response.send(res['rows']);
  });
});



app.post('/api/event_user_role/set', (request, response) => {
  const param = request.body;

  if (typeof param['event_id'] !== 'undefined' && typeof param['user_id'] !== 'undefined' && typeof param['role_id'] !== 'undefined') {
    pool.query("INSERT INTO " + '"event_user_role" ("event_id", "user_id", "role_id")' + " VALUES ('" + param['event_id'] + "', '" + param['user_id'] + "', '" + param['role_id'] + "')");
    response.send("Готово");
  }
  else {
    response.send("Error");
  }
});

app.post('/api/event_user_role/get', (request, response) => {
  const {event_id, user_id, role_id} = request.body;

  sql = 'SELECT * FROM "event_user_role" WHERE TRUE ';

  if (event_id) {
    sql += ` AND event_id = ${event_id}`;
  }

  if (user_id) {
    sql += ` AND user_id = ${user_id}`;
  }

  if (role_id) {
    sql += ` AND role_id = ${role_id}`;
  }

  pool.query(sql).then(function (res) {
    response.send(res['rows']);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dzudo-client/build', 'index.html'));
});


const server = http.createServer(app).listen(port);

// server.setTimeout(300000, function (socket) {
// });
console.log(`HTTP Listening on port ${port}`);
//});


const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  else return "";
}

function cdate() {
  return Math.floor(new Date().getTime() / 1000);
}

// node --env-file .env dzudo-server/app.js 

function Error(message){
  return {"Error": message};
}







