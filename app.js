// require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session')
const mongodb_session = require('connect-mongodb-session')(session);
const PORT = 5000;
const DB_CONN = "mongodb+srv://tkivai123:KjgVKU1A1srWKjz9@cluster0.pekpg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const app = express();
app.use(express.static(__dirname + '/public'));
const session_store = new mongodb_session({
    uri: DB_CONN,
    collection: 'Sessions'
});

//Mongo DB Connection
mongoose.connect(DB_CONN, { useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({ extended: false }));

//Session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: session_store
}));

// Routes
app.use('/users', require('./routes/auth'));
app.use('/', require('./routes/index'));
app.use('/posts', require('./routes/posts'));

app.use((req, res, next) => {
    res.status(404).render("errors/404");
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
