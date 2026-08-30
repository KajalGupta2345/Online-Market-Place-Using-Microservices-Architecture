require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const {initSocketServer} = require('./src/sockets/socket');

const httpServer = http.createServer(app);

initSocketServer(httpServer);

const PORT = process.env.PORT || 5005;
httpServer.listen(PORT, () => {
    console.log(`Ai-Buddy service is running on port ${PORT}`);
});