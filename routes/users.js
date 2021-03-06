const express = require('express');
const router = express.Router();
const user = require('../modules/user');
const bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');

router.use(expressValidator())

router.get('/register', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.render('register');
})

router.post('/register', (req, res) => {
const name = req.body.name;
const email = req.body.email;
const username = req.body.username;
const password = req.body.password;
const password2 = req.body.password2;

req.checkBody('name','Name is required').notEmpty();
req.checkBody('email','Email is required').notEmpty();
req.checkBody('usename','UserName is required').notEmpty();
req.checkBody('password','Password is required').notEmpty();
req.checkBody('password2','Password should be matched').equals(req.body.password);

let errors = req.validationErrors();

if(errors){
    res.render('register',{
        errors:errors
    });  
}else {
    let newUser = new User ({
        name:name,
        email:email,
        username:username,
        password:password
    });
   
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) =>{
        if(err){
            console.log(err);
        }
        newUser.password = hash;
        newUser.save((err) => {
            if(err){
                console.log(err);
                return;
            }else {
                req.flash('success','Registered');
                res.redirect('/user/login');
            }
        })
        });
    })

}

})

router.get('/login', (req, res) => {
    res.render('login');
})
module.exports = router;