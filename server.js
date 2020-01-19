const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
    console.log('hello');
});

let messages = [];


io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    let cliente = socket.handshake.query.cliente;
    let usuario = socket.handshake.query.usuario;
    let usuario_id = socket.handshake.query.usuario_id;
    console.log(cliente, usuario, usuario_id);

    socket.emit('previous￿Message', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })

    socket.on('disconnect', reason => {
        console.log(`Socket desconectado: ${socket.id}`);

    })
});

server.listen(3000, '0.0.0.0');