const express = require('express');
const cors = require('cors');
const PeerServer = require('peer').PeerServer;
const {
    v4: uuidV4
} = require('uuid');

const app = express();
const server = require('http').Server(app);
const peerServer = PeerServer({port: 3001, path: '/'});
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
    res.render('room', {
        roomId: req.params.room
    });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);

        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

server.listen(3000);