const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render("auth/login", {
        isAuthenticated: false
    })
}

exports.postLogin = (req, res) => {
    const {email, password} = req.body;

    let errors = [];

    //Check if all fields have data in them
    if (!email || !password){
        errors.push({msg: "Please fill in all fields"});
        return res.redirect('/users/login');
    }
    User.findOne( { email: email})
    .then(user => {
        if (!user){
            return res.redirect('/users/login');
        }

        bcrypt.compare(password, user.password)
        .then(doesMatch =>{
            if (doesMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    // console.log(err);
                    res.redirect('/');
                    // res.send("Login successfull");
                });
            }
            res.redirect('/users/login');
        })
        .catch(err => {
            res.redirect('/users/login');
        });

    })
    .catch();

    // res.send('Login Successfull');
}

exports.getRegister = (req, res) => {
    // req.session.
    res.render("auth/register", {
        isAuthenticated: false
    })
}

exports.postRegister = (req, res) => {
    const {username, email, password, password2} = req.body;
    console.log(username)

    let errors = [];

    //Check if all fields have data in them
    if (!username || !email || !password || !password2){
        errors.push({msg: "Please fill in all fields"});
    }

    //Check if passwords match
    if (password !== password2){
        errors.push({msg: "The passwords do not match"});
        console.log(errors);
        res.render("auth/register", { errors: errors });
    } else {
        User.findOne({ email: email })
        .then(user => {
            if (user) {
                errors.push({msg: "Email is already registered"});
                res.render("auth/register", { errors: errors });
            } else {
                const newUser = new User({
                    name: username,
                    email,
                    password
                });
                console.log(newUser);

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash
                        newUser.save()
                        .then(user => {
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    });
                });

            }
        })
        .catch();
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/');
    });
}