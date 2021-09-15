require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.SERVER_PORT;
const DB_CONN = process.env.MONGO_URI;

const app = express();

//Mongo DB Connection
mongoose.connect(DB_CONN, { useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//EJS
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/users', require('./routes/users'));
app.use('/', require('./routes/index'));

app.use((req, res, next) => {
    res.status(404).render("errors/404");
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
