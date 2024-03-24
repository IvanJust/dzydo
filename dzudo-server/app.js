const express = require('express');
const { Pool } = require('pg'); 
const http = require("http");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

let app;


process.on('unhandledRejection', (error) => {
    console.log(`Error: ${error?.message}\nStack: ${error?.stack}`);
});

//(async () => {


    app = express();

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    const port = process.env.SERVER_PORT;
    const socket_port = process.env.SOCKET_PORT;
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const pool = new Pool()

    app.post('/token/get', (request, response) => {
        const param = request.body;

        if(typeof param['event_id'] !== 'undefined' && typeof param['login'] !== 'undefined' && typeof param['password'] !== 'undefined'){
            pool.query('SELECT * FROM "user" JOIN "event_user_role" ON "user_id"="user"."id" WHERE "event_id"=' + param['event_id'] + ' AND "login"=' + "'" + param['login'] + "'"+' AND "password"=' + "'" + param['password'] + "'").then(function(res){
                if(res['rows'] != []){
                    response.send(jwt.sign({
                        sub: res['rows']['id'],
                        ext: cdate(),
                        role: res['rows']['role_id'],
                    }, jwtSecretKey));
                }
                else{
                    response.send("Error");
                } 
            });
        }
        else{
            response.send("Error");
        }
    });

    app.post('/token/check', (request, response) => {
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


    
    app.post('/user/set', (request, response) => {
        const param = request.body;

        if(typeof param['lastname'] !== 'undefined' && typeof param['firstname'] !== 'undefined' && typeof param['patronymic'] !== 'undefined' && typeof param['login'] !== 'undefined' && typeof param['password'] !== 'undefined'){
            pool.query("INSERT INTO "+'"user" ("lastname", "firstname", "patronymic", "login", "password")' + " VALUES ('" + param['lastname'] + "', '" + param['firstname'] + "', '" + param['patronymic'] + "', '" + param['login'] + "', '" + param['password'] + "')"); 
            response.send("Готово");
        }
        else{
            response.send("Error");
        }
    });

    app.post('/user/get', (request, response) => {
        const param = request.body;

        sql = 'SELECT * FROM "user"';

        if(typeof param['id'] !== 'undefined'){
            sql += 'WHERE "id"=' + param['id'];
        }

        pool.query(sql).then(function(res){
            response.send(res['rows']);
        });
    });



    app.post('/event/set', (request, response) => {
        const param = request.body;

        if(typeof param['name'] !== 'undefined' && typeof param['place'] !== 'undefined' && typeof param['date'] !== 'undefined'){
            pool.query("INSERT INTO "+'"event" ("name", "place", "date")'+" VALUES ('" + param['name'] + "', '" + param['place'] + "', '" + param['date'] + "')"); 
            response.send("Готово");
        }
        else{
            response.send("Error");
        }
    });

    app.post('/event/get', (request, response) => {
        const param = request.body;

        sql = 'SELECT * FROM "event"';

        if(typeof param['id'] !== 'undefined'){
            sql += 'WHERE "id"=' + param['id'];
        }

        pool.query(sql).then(function(res){
            response.send(res['rows']);
        });
    });



    app.post('/role/set', (request, response) => {
        const param = request.body;

        if(typeof param['name'] !== 'undefined'){
            pool.query("INSERT INTO " + '"role" ("name")'+" VALUES ('" + param['name'] + "')"); 
            response.send("Готово");
        }
        else{
            response.send("Error");
        }
    });

    app.post('/role/get', (request, response) => {
        const param = request.body;

        sql = 'SELECT * FROM "role"';

        if(typeof param['id'] !== 'undefined'){
            sql += 'WHERE "id"=' + param['id'];
        }

        pool.query(sql).then(function(res){
            response.send(res['rows']);
        });
    });
    


    app.post('/event_user_role/set', (request, response) => {
        const param = request.body;

        if(typeof param['event_id'] !== 'undefined' && typeof param['user_id'] !== 'undefined' && typeof param['role_id'] !== 'undefined'){
            pool.query("INSERT INTO "+'"event_user_role" ("event_id", "user_id", "role_id")' + " VALUES ('" + param['event_id'] + "', '" + param['user_id'] + "', '" + param['role_id'] + "')"); 
            response.send("Готово");
        }
        else{
            response.send("Error");
        }
    });

    app.post('/event_user_role/get', (request, response) => {
        const param = request.body;

        sql = 'SELECT * FROM "event_user_role"';

        if(typeof param['id'] !== 'undefined'){
            sql += 'WHERE "id"=' + param['id'];
        }

        pool.query(sql).then(function(res){
            response.send(res['rows']);
        });
    });




    const server = http.createServer(app).listen(port);

    server.setTimeout(300000, function(socket) {
        console.log(`HTTP Listening on port ${port}`);
    });
//});


const getTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];   
    }
    else return "";
}

function cdate(){
    return Math.floor(new Date().getTime() / 1000);
}

// node --env-file .env dzudo-server/app.js 