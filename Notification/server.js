require('dotenv').config();
const app = require('./src/app');
const {connect} = require('./src/broker/broker');
const setListeners = require('./src/broker/listeners');

connect().then(()=>{
    setListeners();
});


const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
    console.log(`Notification service is running on port ${PORT}`);
});