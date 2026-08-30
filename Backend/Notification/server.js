require('dotenv').config();
const app = require('./src/app');
const {connect} = require('./src/broker/broker');
const setListeners = require('./src/broker/listeners');

connect().then(() => {
    console.log('Setting up listeners...');
    setListeners();
    console.log('Listeners set up successfully');
}).catch((err) => {
    console.log('ERROR in connect/setListeners:', err);
});


const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
    console.log(`Notification service is running on port ${PORT}`);
});