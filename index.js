const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {

    let nickName;

    socket.broadcast.emit('connection', "hi")

    socket.on('api_connect', (parameter) => {
        nickName = parameter.nickName;
        var helloMsg = "hello "+nickName

        socket.broadcast.emit('api_connect', {
            nickName,
            helloMsg
    })

    })

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', "["+nickName+"] "+msg);
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('disconnection', "bye "+nickName)
    })

    socket.on('writing', (value) => {
        var msg = "";
        if(value !== "") {
            msg = nickName+" is writing...";
        }
        console.log("msg > " ,msg)
        socket.broadcast.emit('writing', msg)
    })

})


http.listen(3000, () => {
    console.log('listening on *:3000')
})
