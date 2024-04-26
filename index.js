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
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
    
    let verified = jwt.verify(token, jwtSecretKey);
    if(verified) verified = jwt.decode(token);
    else throw 'Error';
    
    pool.query('UPDATE "event_user_role" SET socket_id = $1 WHERE event_id = $2 AND user_id = $3 AND role_id = $4', [socket.id, verified.event_id, verified.sub, verified.role]);
  } catch (error) {
    console.log('Токена нет');
  }
  
  socket.on('disconnecting', (message) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

      let verified = jwt.verify(token, jwtSecretKey);
      if(verified) verified = jwt.decode(token);
      else throw 'Error';

      pool.query('UPDATE "event_user_role" SET socket_id = NULL WHERE event_id = $1 AND user_id = $2 AND role_id = $3', [verified.event_id, verified.sub, verified.role]);
    } catch (error) {
      console.log(error);
    }
  });

  socket.use(([event_name, message, Ack], next) => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
        exception = [
          'table-get-2',
        ];
        
        if(exception.indexOf(event_name) != -1) return next();

        let verified = jwt.verify(token, jwtSecretKey);
        if(verified) verified = jwt.decode(token);
        else throw 'Error';

        socket.user_id = verified['sub'];
        socket.role_id = verified['role'];
        socket.event_id = verified['event_id'];

        next();

    } catch (error) {
        Ack(Error('Token verification error in socket.'));
    }
  });





  socket.on('next-round', (message, ack) => {
    try {
      // console.log("user_id=" + socket.user_id);
      // console.log("role_id=" + socket.role_id);
      // console.log("event_id=" + socket.event_id);
      
      pool.query('SELECT * FROM "pair" WHERE event_id = $1 AND condition = 1', [socket.event_id]).then(function (res) {
        if(res['rows'].length > 0) ack(Error('Socket operation error next-round.'));

        pool.query('SELECT * FROM "pair" WHERE event_id = $1 AND condition = 0 ORDER BY round,id LIMIT 1', [socket.event_id]).then(function (res1) {
          if(res1['rows'].length == 0) ack(Error('Socket operation error next-round.'));
          curr_pair = res1['rows'][0];
          //ack(curr_pair);
          
          pool.query('UPDATE "pair" SET condition = 1 WHERE id = $1', [curr_pair['id']]);
          
          curr_pair['condition'] = 1;
          pool.query('SELECT socket_id FROM "event_user_role" WHERE role_id < 5').then(function (res2) {
            res2['rows'].forEach((value) => {
              socketIO.to(value.socket_id).emit('change-round', curr_pair);
            });
          });
        });
      });

    } catch (error) {
      ack(Error('Socket operation error next-round.'));
    }
  });
  
  socket.on('skip-round', (message, ack) => {
    try {
      
      pool.query('SELECT * FROM "pair" WHERE event_id = $1 AND condition IN (0, 1) ORDER BY round, id LIMIT 1', [socket.event_id]).then(function (res1) {
        if(res1['rows'].length == 0) ack(Error('Socket operation error next-round.'));
        curr_pair = res1['rows'][0];
        
        pool.query('UPDATE "pair" SET condition = 3 WHERE id = $1', [curr_pair['id']]);
        
        curr_pair['condition'] = 3;
        pool.query('SELECT socket_id FROM "event_user_role" WHERE role_id < 5').then(function (res2) {
          res2['rows'].forEach((value) => {
            socketIO.to(value.socket_id).emit('change-round', curr_pair);
          });
        });
      });
      

    } catch (error) {
      ack(Error('Socket operation error next-round.'));
    }
  });
});



socketIO.listen(socket_port);



app.use((request, response, next) => {  
  try {
      exception = [
          '/api/token/get',
          '/api/event/get',
          '/api/table/get',
      ];
       
      if(exception.indexOf(request.originalUrl) != -1) return next();
      
      const verified = check(request, response);
      
      if(!verified) return response.status(401).send(Error('The token is not valid.'));
      
      request.user_id = verified['sub'];
      request.role_id = verified['role'];
      request.event_id = verified['event_id'];

      return next();

  } catch (error) {
     response.status(500).send(Error('Token verification error.'));
  }
});


app.get('/api', (request, response) => {
  res.json({ message: "Hello from server!" });
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
                  event_id: event_id,
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

      pool.query('INSERT INTO "event" (name, place, date_begin, date_end) VALUES ($1, $2, $3, $4)', [name, place, date_begin, date_end]);
      
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

  sql = 'SELECT "event_user_role".id, row_to_json(e.*) AS event, row_to_json(u.*) AS user, row_to_json(r.*) AS role FROM "event_user_role" JOIN "event" AS e ON e.id = event_id JOIN "user" AS u ON u.id = user_id JOIN "role" AS r ON r.id = role_id WHERE TRUE';

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
  const { group_id , title , init_value } = request.body;

  try {
      if (!group_id || !title || !init_value) throw "Error";
  
      pool.query('INSERT INTO "evaluation_criteria" (group_id, title, init_value) VALUES ($1, $2, $3)', [group_id, title, init_value]);
      response.send(Successfully('The evaluation_criteria was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the evaluation_criteria.'));
  }
  
});

app.post('/api/evaluation_criteria/get', (request, response) => {
  const { id } = request.body;

  try {
      sql = 'SELECT "evaluation_criteria".id, "evaluation_criteria".id, "evaluation_criteria".title AS evaluation_criteria, row_to_json("evaluation_group".*) AS evaluation_group, init_value FROM "evaluation_criteria" JOIN "evaluation_group" ON "evaluation_group".id = "evaluation_criteria".group_id ';

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
  const { id , event_id } = request.body;

  try {
      sql = 'SELECT "pair".id, row_to_json(u1.*) AS tori, row_to_json(u2.*) AS uke, region, row_to_json("event".*) AS event, round, condition  FROM "pair" JOIN "user" AS u1 ON u1.id = tori JOIN "user" AS u2 ON u2.id = uke JOIN "event" ON "event".id = event_id ';

      if (id) sql += 'WHERE "pair".id=' + id;

      if (event_id) sql += 'WHERE "pair".event_id=' + event_id;
      
      sql += 'ORDER BY "pair".round, "pair".id ASC';
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the pair.'));
  }
});

app.post('/api/pair/update', (request, response) => {
  pairs = request.body['pair'];

  try{
    if( !pairs ) throw 'Error';

    pairs.forEach(element => {
      const id = element['id'], round = element['round'];
      
      if( !id || !round ) throw 'Error';
      
      pool.query('UPDATE "pair" SET round = $1 WHERE id = $2', [round, id]);
    });
    
    response.send(Successfully('Pairs have been successfully updated'));
  }
  catch (e) {
    response.status(500).send(Error('Error receiving the pair.'));
  }

});




app.post('/api/table/get', (request, response) => {
  const { event_id } = request.body;
  
  try {
    if ( !event_id ) throw "Error";

    sql = 'SELECT "pair".id, row_to_json(u1.*) AS tori, row_to_json(u2.*) AS uke, region, row_to_json("event".*) AS event, round, condition  FROM "pair" JOIN "user" AS u1 ON u1.id = tori JOIN "user" AS u2 ON u2.id = uke JOIN "event" ON "event".id = event_id WHERE condition > 1 AND "event".id = $1 ORDER BY "pair".round, "pair".id DESC';
    
    pool.query(sql, [event_id]).then(function (res) {
        response.send(res['rows']);
    });

  } catch (e) {
    response.status(500).send(Error('Error receiving the pair.'));
  }
});





app.post('/api/evaluations/set', async (request, response) => {
  const { pair_id , evaluations } = request.body;

  try {
      if ( !evaluations || !pair_id ) throw "Error";

      evaluations.forEach(items => {
        var params = [items.pair_id, items.evaluation_criteria_id, items.mark_id, request.user_id];
        if(request.role_id == 3) {
          params.push(items.referee_id);
          items['supervisor_id'] = request.user_id;
          pool.query('INSERT INTO "evaluations" (pair_id, evaluation_criteria_id, mark_id, supervisor_id, referee_id) VALUES ($1, $2, $3, $4, $5)', params);
        }
        else if(request.role_id == 4){
          items['referee_id'] = request.user_id;
          pool.query('INSERT INTO "evaluations" (pair_id, evaluation_criteria_id, mark_id, referee_id) VALUES ($1, $2, $3, $4)', params);
        }  
      });
        
      if(request.role_id == 3) {
        await pool.query('UPDATE "pair" SET condition = 2 WHERE id = $1', [pair_id]);
        pool.query('SELECT * FROM "pair" WHERE id = $1', [pair_id]).then(function (res1) {
          pool.query('SELECT socket_id FROM "event_user_role" WHERE role_id < 5').then(function (res) {
            res['rows'].forEach((value) => {
              socketIO.to(value.socket_id).emit('save-evaluations-supervisor', evaluations);
              socketIO.to(value.socket_id).emit('change-round', res1['rows']);
            }); 
          });
        });
      }
      else if(request.role_id == 4){
        pool.query('SELECT socket_id FROM "event_user_role" WHERE role_id=3').then(function (res) {
          res['rows'].forEach((value) => {
            socketIO.to(value.socket_id).emit('save-evaluations-referee', evaluations);
          });
        });
      }


      response.send(Successfully('The evaluations was saved successfully.'));
  
  } catch (e) {
      response.status(500).send(Error('Error saving the evaluations.'));
  }
  
});

app.post('/api/evaluations/get', (request, response) => {
  const { id } = request.body;
  
  try {
      sql = 'SELECT "evaluations".id, row_to_json(p.*) AS pair, row_to_json(u1.*) AS referee, row_to_json(u2.*) AS supervisor, row_to_json(ec.*) AS evaluation_criteria, row_to_json(m.*) AS mark, date '
      + 'FROM "evaluations" '
      + 'JOIN "pair" AS p ON p.id = pair_id '
      + 'LEFT JOIN "user" AS u1 ON u1.id = referee_id '
      + 'LEFT JOIN "user" AS u2 ON u2.id = supervisor_id '
      + 'JOIN "evaluation_criteria" AS ec ON ec.id = evaluation_criteria_id '
      + 'JOIN "mark" AS m ON m.id = mark_id ';

      if (id) sql += 'WHERE "evaluations".id = ' + id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the evaluations.'));
  }
});


app.post('/api/evaluations/getforsuper', (request, response) => {
  const { pair_id , user_id } = request.body;
  
  try {
      sql = 'SELECT "evaluations".id, row_to_json(p.*) AS pair, row_to_json(u1.*) AS referee, supervisor_id AS supervisor, row_to_json(ec.*) AS evaluation_criteria, row_to_json(m.*) AS mark, date '
      + 'FROM "evaluations" '
      + 'JOIN "pair" AS p ON p.id = pair_id AND p.event_id = ' + request.event_id
      + 'LEFT JOIN "user" AS u1 ON u1.id = referee_id '
      + 'JOIN "evaluation_criteria" AS ec ON ec.id = evaluation_criteria_id '
      + 'JOIN "mark" AS m ON m.id = mark_id '
      + 'WHERE supervisor_id IS NULL ';

      if (pair_id) sql += 'AND "evaluations".pair_id = ' + pair_id;
      if (user_id) sql += ' AND "evaluations".referee_id = ' + user_id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the evaluations.'));
  }
});

app.post('/api/evaluations/getforsecretary', (request, response) => {
  const { pair_id , user_id } = request.body;
  
  try {
      sql = 'SELECT "evaluations".id, row_to_json(p.*) AS pair, row_to_json(u1.*) AS referee, row_to_json(u2.*) AS supervisor, row_to_json(ec.*) AS evaluation_criteria, row_to_json(m.*) AS mark, date '
      + 'FROM "evaluations" '
      + 'JOIN "pair" AS p ON p.id = pair_id AND p.event_id = ' + request.event_id
      + 'LEFT JOIN "user" AS u1 ON u1.id = referee_id '
      + 'LEFT JOIN "user" AS u2 ON u2.id = supervisor_id '
      + 'JOIN "evaluation_criteria" AS ec ON ec.id = evaluation_criteria_id '
      + 'JOIN "mark" AS m ON m.id = mark_id '
      + 'WHERE supervisor_id IS NOT NULL ';

      if (pair_id) sql += 'AND "evaluations".pair_id = ' + pair_id;
      if (user_id) sql += ' AND "evaluations".supervisor_id = ' + user_id;
      
      pool.query(sql).then(function (res) {
          response.send(res['rows']);
      });

  } catch (e) {
      response.status(500).send(Error('Error receiving the evaluations.'));
  }
});

app.post('/api/current_event/get', async (request, response) => {
  const res = await pool.query('SELECT * FROM "event" WHERE date_begin <= CURRENT_DATE AND CURRENT_DATE <= date_end');
  
  response.send(res['rows']);
});

app.post('/api/future_event/get', async (request, response) => {
  const res = await pool.query('SELECT * FROM "event" WHERE CURRENT_DATE < date_begin');
  
  response.send(res['rows']);
});


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dzudo-client/build', 'index.html'));
});


const server = http.createServer(app).listen(port);


console.log(`HTTP Listening on port ${port}`);



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

function dateFormat(date){
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}

function check(request, response){
  try{
      const token = getTokenFromHeader(request);
      let verified = jwt.verify(token, jwtSecretKey);

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
// pm2 start ecosystem.config.js
// pm2 logs
// pm2 delete all