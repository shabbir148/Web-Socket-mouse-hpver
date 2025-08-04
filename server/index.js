const http = require('http');
const { parse } = require('url');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer();

const wss = new WebSocketServer({ server});
const User = {}
const Connection = {}

const broadcastState = () => {
    const state = Object.values(User).map(user => ({
        username: user.username,
        state: user.state
    }));
    const message = JSON.stringify(state);
    Object.values(Connection).forEach((connection) => {
        if (connection.readyState === connection.OPEN) {
            connection.send(message);
        }
    }
    );
}
const handlemessage = (message,uuid) => {
    const data = JSON.parse(message.toString());
    const user = User[uuid];
    user.state = data;
    console.log(`User ${user.username} updated state:`, user.state);
    broadcastState();
}

const handleClose = (uuid) => {
    delete User[uuid];
    delete Connection[uuid];
    console.log(`User ${uuid} disconnected`);
    broadcastState();
}

wss.on('connection', (connection, req) => {
    console.log('New connection established');
    connection.send('Welcome to the WebSocket server!');
    connection.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    const {username} = parse(req.url, true).query;
    const id = uuidv4();
    User[id] = {
        username,
        state : {
            x: 0,
            y:0
        }
    }
    Connection[id] = connection;

    connection.on('message', (message) => { handlemessage(message,id) })
    connection.on('close', () => { handleClose(id); console.log(`Connection closed for user ${id}`);  });
})

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});