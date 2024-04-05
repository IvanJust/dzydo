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

app.get('/api', (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use((request, response, next) => {  
  try {
      exception = [
          '/api/token/get',
          '/api/event/get',
      ];
       
      if(exception.indexOf(request.originalUrl) != -1) return next();
      
      const verified = check(request, response);
      
      if(!verified) return response.status(401).send(Error('The token is not valid.'));
      
      request.user_id = verified['sub'];
      request.role_id = verified['role'];

      return next();

  } catch (error) {
      return response.status(500).send(Error('Token verification error.'));
  }
});



app.post('/api/token/get', (request, response) => {
  const { event_id, login, password } = request.body;

  try {
      if (!event_id || !login || !password) throw "Error";
      
      pool.query('SELECT * FROM "user" JOIN event_user_role ON user_id="user".id WHERE event_id=$1 AND login=$2 AND password=$3', [event_id, login, password]).then(function (res) {
          if (res['rows'].length > 0){
              response.send({
              token: jwt.sign({
                  sub: res['rows'][0]['id'],
                  ext: cdate(),
                  role: res['rows'][0]['role_id'],
              }, jwtSecretKey),
              sub: res['rows'][0]['id'],
              ext: cdate(),
              role: res['rows'][0]['role_id'],
              });
          }
          else response.status(401).send(Error('The user was not found.'));
      });
  
  } catch (e) {
      response.status(500).send(Error('Error receiving the user.'));
      //response.status(500).send(e);
  }
});

app.post('/api/token/check', (request, response) => {
  return response.send(Successfully('The token is valid.'));
});



app.post('/api/user/set', (request, response) => {
  const { lastname, firstname, patronymic, login, password } = request.body;
  
  try {
      if (!lastname || !firstname || !patronymic || !login || !password) throw "Error";

      pool.query('INSERT INTO "user" (lastname, firstname, patronymic, login, password) VALUES ($1, $2, $3, $4, $5)', [lastname, firstname, patronymic, login, password]);

      response.send(Successfully('The user has been successfully saved.'));
  } catch (e) {
      response.status(500).send(Error('User save error.'));
  }
});

app.post('/api/user/get', (request, response) => {
  const { id } = request.body;

  try {
      sql = 'SELECT * FROM "user" ';

      if (id) sql += 'WHERE id=' + id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the user.'));
  }
});



app.post('/api/event/set', (request, response) => {
  const { name, place, date_begin, date_end } = request.body;

  try {
      if (!name || !place || !date_begin || !date_end) throw "Error";

      pool.query('INSERT INTO "event" (name, place, date) VALUES ($1, $2, $3, $4)', [name, place, date_begin, date_end]);
      
      response.send(Successfully('The event was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the event.'));
  }
});

app.post('/api/event/get', (request, response) => {
  const { id } = request.body;

  try {
      sql = 'SELECT * FROM "event" ';

      if (id) sql += 'WHERE id=' + id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the event.'));
  }
});



app.post('/api/role/set', (request, response) => {
  const { name } = request.body;

  try {
      if (!name) throw "Error";
  
      pool.query('INSERT INTO "role" (name) VALUES ($1)', [name]);
      response.send(Successfully('The role was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the role.'));
  }
  
});

app.post('/api/role/get', (request, response) => {
  const { id } = request.body;

  try {
      sql = 'SELECT * FROM "role" ';

      if (id) sql += 'WHERE id=' + id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the role.'));
  }
});



app.post('/api/event_user_role/set', (request, response) => {
  const { event_id, user_id , role_id } = request.body;

  try {
      if (!event_id || !user_id || !role_id) throw "Error";
  
      pool.query('INSERT INTO "event_user_role" (event_id, user_id, role_id) VALUES ($1, $2, $3)', [event_id, user_id, role_id]);
      response.send(Successfully('The event_user_role was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the event_user_role.'));
  }
});

app.post('/api/event_user_role/get', (request, response) => {
  const {event_id, user_id, role_id} = request.body;

  sql = 'SELECT row_to_json(e.*) AS event, row_to_json(u.*) AS user, row_to_json(r.*) AS role FROM "event_user_role" JOIN "event" AS e ON e.id = event_id JOIN "user" AS u ON u.id = user_id JOIN "role" AS r ON r.id = role_id WHERE TRUE';

  try {
      if (event_id) sql += ` AND event_id = ${event_id}`;

      if (user_id) sql += ` AND user_id = ${user_id}`;
      
      if (role_id) sql += ` AND role_id = ${role_id}`;
      

      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the event_user_role.'));
  }
});


app.post('/api/evaluation_criteria/set', (request, response) => {
  const { group_id , title } = request.body;

  try {
      if (!group_id || !title) throw "Error";
  
      pool.query('INSERT INTO "evaluation_criteria" (group_id, title) VALUES ($1, $2)', [group_id, title]);
      response.send(Successfully('The evaluation_criteria was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the evaluation_criteria.'));
  }
  
});

app.post('/api/evaluation_criteria/get', (request, response) => {
  const { id } = request.body;

  try {
      sql = 'SELECT "evaluation_criteria".id, "evaluation_criteria".title AS evaluation_criteria, row_to_json("evaluation_group".*) AS evaluation_group FROM "evaluation_criteria" JOIN "evaluation_group" ON "evaluation_group".id = "evaluation_criteria".group_id ';

      if (id) sql += 'WHERE "evaluation_criteria".id=' + id;

      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the evaluation_criteria.'));
  }
});


app.post('/api/evaluation_group/set', (request, response) => {
  const { title } = request.body;

  try {
      if (!title) throw "Error";
  
      pool.query('INSERT INTO "evaluation_group" (title) VALUES ($1)', [title]);
      response.send(Successfully('The evaluation_group was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the evaluation_group.'));
  }
  
});

app.post('/api/evaluation_group/get', (request, response) => {
  const { id } = request.body;

  try {
      sql = 'SELECT * FROM "evaluation_group" ';

      if (id) sql += 'WHERE id=' + id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the evaluation_group.'));
  }
});


app.post('/api/mark/set', (request, response) => {
  const { name , score , max } = request.body;

  try {
      if (!name || !score || !max) throw "Error";
  
      pool.query('INSERT INTO "mark" (name, score, max) VALUES ($1, $2, $3)', [name, score, max]);
      response.send(Successfully('The mark was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the mark.'));
  }
  
});

app.post('/api/mark/get', (request, response) => {
  const { id } = request.body;

  try {
      sql = 'SELECT * FROM "mark" ';

      if (id) sql += 'WHERE id=' + id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the mark.'));
  }
});


app.post('/api/pair/set', (request, response) => {
  const { tori , uke , region , event_id , round } = request.body;

  try {
      if (!tori || !uke || !region || !event_id || !round) throw "Error";
  
      pool.query('INSERT INTO "pair" (tori, uke, region, event_id, round) VALUES ($1, $2, $3, $4, $5)', [tori, uke, region, event_id, round]);
      response.send(Successfully('The pair was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the pair.'));
  }
  
});

app.post('/api/pair/get', (request, response) => {
  const { id } = request.body;

  try {
      sql = 'SELECT row_to_json(u1.*) AS tori, row_to_json(u2.*) AS uke, region, row_to_json("event".*) AS event, round  FROM "pair" JOIN "user" AS u1 ON u1.id = tori JOIN "user" AS u2 ON u2.id = uke JOIN "event" ON "event".id = event_id ';

      if (id) sql += 'WHERE "pair".id=' + id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the pair.'));
  }
});






app.post('/api/evaluations/set', (request, response) => {
  const { pair_id , evaluation_criteria_id , mark_id} = request.body;

  try {
      if (!pair_id || !evaluation_criteria_id || !mark_id) throw "Error";

      
      var role = '', param = '', params = [pair_id, evaluation_criteria_id, mark_id];
      if(request.role_id == 3) {
          role = ',supervisor_id';
          param = ', $4';
          params.push(request.user_id);
      }
      else if(request.role_id == 4){
          role = ',referee_id';
          param = ', $4';
          params.push(request.role_id);
      }
  
      pool.query(`INSERT INTO "evaluations" (pair_id, evaluation_criteria_id, mark_id ${role}) VALUES ($1, $2, $3 ${param})`, params);
      response.send(Successfully('The evaluations was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the evaluations.'));
  }
  
});

app.post('/api/evaluations/get', (request, response) => {
  const { id } = request.body;
  
  try {
      sql = 'SELECT row_to_json(p.*) AS pair, row_to_json(u1.*) AS referee, row_to_json(u2.*) AS supervisor, row_to_json(ec.*) AS evaluation_criteria, row_to_json(m.*) AS mark, date '
      + 'FROM "evaluations" JOIN "pair" AS p ON p.id = pair_id '
      + 'LEFT JOIN "user" AS u1 ON u1.id = referee_id '
      + 'LEFT JOIN "user" AS u2 ON u2.id = supervisor_id '
      + 'JOIN "evaluation_criteria" AS ec ON ec.id = evaluation_criteria_id '
      + 'JOIN "mark" AS m ON m.id = mark_id ';

      if (id) sql += 'WHERE "evaluations".id = ' + id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the pair.'));
  }
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

function cdate(){
  const curr_date = new Date();
  curr_date.setFullYear(curr_date.getFullYear() + 1); 

  return Math.floor(curr_date.getTime() / 1000);
}

function check(request, response){
  try{
      const token = getTokenFromHeader(request);
      const verified = jwt.verify(token, jwtSecretKey);

      if(verified) return jwt.decode(token);
      else throw 'Error';

  } catch (e) {
      return false;
  }
}

function Successfully(message){
  return {
      'Successfully':message,
  };
}

function Error(message){
  return {
      'Error': message,
  };
}

// node --env-file .env dzudo-server/app.js 








