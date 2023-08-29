require('dotenv').config();
require('./db/db');
const { default: mongoose } = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT;
const { register, login, logout } = require('./controllers/user.controller')
const { news, addnews, addcomment, deletecomment } = require('./controllers/news.contraller')
const { auth, adminAuth } = require('./middleware/auth')

const urlencodedParser = express.urlencoded({extended: false})
// app.use(cors());
app.use(cors({ origin: 'http://127.0.0.1:5501', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(urlencodedParser, function(request, response, next){
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', register);

app.post('/login', login);

app.get('/logout', logout);

app.get('/news', news);

app.post('/addnews', auth, adminAuth, addnews);

app.post('/addcomment', auth, addcomment);

app.delete('/deletecomment/:id', auth, adminAuth, deletecomment)

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
  console.log('DB connection established')
})