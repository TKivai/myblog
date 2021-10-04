const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
        return res.status(400).json({
            msg: "Error",
            errors
        });
    }
    User.findOne( { email: email})
    .then(user => {
        if (!user){
            errors.push({msg: "The user does not exist"});
            return res.status(400).json({
                msg: "Error",
                errors
            });
        }

        bcrypt.compare(password, user.password)
        .then(doesMatch =>{
            if (doesMatch) {
                // req.session.isLoggedIn = true;
                // req.session.user = user;

                // return req.session.save(err => {
                //     // console.log(err);
                //     // res.redirect('/');
                //     // res.send("Login successfull");
                //     const token = generateAccessToken({user: user._id});
                //     res.cookie('token', token, { httpOnly: true });
                //     res.status(200).json({
                //         msg: "Success",
                //         token: token
                //     });
                // });

                // res.cookie('token', token, { sameSite: "Lax"});

                const token = generateAccessToken(
                    {
                        userid: user._id
                    }
                );
                
                return res.status(200).json({
                    msg: "Success",
                    token: token,
                    user: {
                        name: user.name,
                        email: user.email
                    }
                });
            }
            errors.push({msg: "Wrong username or password"});
            return res.status(400).json({
                msg: "Error",
                errors
            });
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

    let errors = [];

    //Check if all fields have data in them
    if (!username || !email || !password || !password2){
        errors.push({msg: "Please fill in all fields"});
    }

    //Check if passwords match
    if (password !== password2){
        // res.render("auth/register", {
        //      errors: errors,
        //      isAuthenticated: false
        // });
        errors.push({msg: "The passwords do not match"});
        return res.status(401).json({
            msg: "Error",
            errors
        });
    } else {
        User.findOne({ email: email })
        .then(user => {
            if (user) {
                // res.render("auth/register", {
                //      errors: errors,
                //      isAuthenticated: false
                // });
                errors.push({msg: "Email is already registered"});
                return res.status(401).json({
                    msg: "Error",
                    errors
                });
            } else {
                const newUser = new User({
                    name: username,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            // res.redirect('/users/login');
                            // res.status(200).json(user);
                            res.status(200).json({
                                msg: "Success",
                            });
                        })
                        .catch(err => console.log(err));
                    });
                });

            }
        })
        .catch(err => {
            console.log(err);
        });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/');
    });
}

function generateAccessToken(unique_data) {
    return jwt.sign(unique_data, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}