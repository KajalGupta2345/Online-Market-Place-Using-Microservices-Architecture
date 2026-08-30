require('dotenv').config();
const app = require('./src/app');
const connectedToDb = require('./src/db/db');

connectedToDb();


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`cart service is running on port ${PORT}`);
});