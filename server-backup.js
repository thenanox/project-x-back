/*************************************
//
// node-socket app
//
**************************************/
'use strict';

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var device = require('express-device');
var r = require('rethinkdb');
var connection = null;

var runningPortNumber = 80;

app.configure(function () {
    // I need to access everything in '/public' directly
    app.use(express.static(__dirname + '/public'));

    //set the view engine
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    app.use(device.capture());
});

// logs every request
app.use(function (req, res, next) {
    // output every request in the array
    console.log({
        method: req.method,
        url: req.url,
        device: req.device
    });

    // goes onto the next function in line
    next();
});

app.get('/', function (req, res) {
    res.render('index', {});
});

r.connect({
    host: 'localhost',
    port: 28015
}, function (err, conn) {
    if (err) {
        throw err;
    }
    connection = conn;
    r.table('member').changes().run(connection, function (err, cursor) {
        if (err) {
            throw err;
        }
        cursor.each(function (err, row) {
            if (err) {
                throw err;
            }
            console.log(JSON.stringify(row, null, 2));
            io.sockets.emit('new-identified', {
                name: row.new_val.name,
                timestamp: new Date().getTime()
            });
        });
    });
});

io.sockets.on('connection', function (socket) {
    r.table('member').run(connection, function (err, cursor) {
        if (err) {
            throw err;
        }
        cursor.toArray(function (err, result) {
            if (err) {
                throw err;
            }
            console.log(JSON.stringify(result, null, 2));
            io.sockets.emit('new-identified', {
                name: result[0].name,
                timestamp: new Date().getTime()
            });
        });
    });

    socket.on('identified', function (data, fn) {
        console.log(data);
        r.table('member').update({
            name: data.name
        }).
        run(connection, function (err, result) {
            if (err) {
                throw err;
            }
            console.log(JSON.stringify(result, null, 2));
            io.sockets.emit('blast', {
                msg: '<span style=\"color:red !important\">' + data.name + ' connected</span>'
            });
            fn();
        });
    });

    socket.on('blast', function (data, fn) {
        console.log(data);
        io.sockets.emit('blast', {
            msg: data.msg
        });

        fn(); //call the client back to clear out the field
    });

});

server.listen(runningPortNumber);
console.log('Listening on port ' + runningPortNumber + '...');
