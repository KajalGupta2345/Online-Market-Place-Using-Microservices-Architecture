require('dotenv').config();
const app = require('./src/app');
const connectedToDb = require('./src/db/db');
const {connect} = require('./src/broker/broker');
const listeners = require('./src/broker/listeners');


connectedToDb();
connect().then(() => {
    listeners();
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`product service is running on port ${PORT}`);
});