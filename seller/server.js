require('dotenv').config();
const  listeners = require('./src/broker/listeners');
const app = require('./src/app');
const {connect} = require('./src/broker/broker');
const connectToDB = require('./src/db/db');

connectToDB();
connect().then(()=>{
    listeners();
})



const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
  console.log(`Seller service running on port ${PORT}`);
});