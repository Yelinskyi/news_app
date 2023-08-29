const mongoose = require('mongoose');

const dbBaseUrl = process.env.DB_URL;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

let uri = dbBaseUrl.replace('<password>', dbPassword);
uri = uri.replace('<db-name>', dbName); 

console.log(uri)

module.exports = mongoose.connect(uri, {
	useNewUrlParser: true, 
	useUnifiedTopology: true
}).catch(err=>console.log('DB connection error: ', err));
  