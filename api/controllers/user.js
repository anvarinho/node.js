const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) =>{
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if (user.length >= 1){
            return res.status(422).json({ message: "User with this email already exists"})
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                console.log(hash)
                if(err){
                    res.status(500).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId,
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                        .then(result => {
                            console.log(result)
                            res.status(201).json({ message: "User Created"})
                        }).catch(err => {
                            console.log(err)
                            res.status(500).json(err)
                        })
                }
            })
        }
    })
}

exports.login = (req, res, next)=>{
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user);
            if (user.length < 1) {
                return res.status(401).json({
                message: "Auth failed"
                });
            }
            console.log('Provided Password:', req.body.password);
            console.log('Stored Password:', user[0].password);
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err){
                    console.error('Error during comparison:', err);
                    return res.status(401).json({ message: "Auth failed"})
                }
                if (result){
                    const token = jwt.sign(
                        {email: user[0].email, userId: user[0]._id }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )
                    console.log('Password matched!');
                    return res.status(200).json({ message: "Auth successful", token: token})
                }
                console.log('Password did not match!');
                res.status(401).json({ message: "Auth fails"})
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
}

exports.delete_account = (req, res, next)=>{
    User.deleteOne({_id: req.params.userId}).exec()
        .then(result => {
            res.status(200).json({ message: "User deleted!"})
        }).catch(err => {
            res.status(500).json({ error: err })
        })
}