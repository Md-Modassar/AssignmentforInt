const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const userModel = require('../Model/userModel')

exports.authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        
        if (!token) { return res.status(400).send({ status: false, message: "Token is mandatory" }) }
        token = token.split(" ")

        jwt.verify(token[1], "mdmodassar", (error, decoded) => {
            if (error) return res.status(401).send({ status: false, message: error.message })
            req.id = decoded.userid
            next();
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

exports.authrization = async (req, res, next) => {
    try {
        let userid = req.params.userId
        if (!objectId.isValid(userid)) { return res.status(400).send({ status: false, msg: "please enter valide userid" }) }
        const userexit = await userModel.findById(userid)
        if (!userexit) { return res.status(404).send({ status: false, msg: "userid not found" }) }

        if (userid !== req.id) { return res.status(403).send({ status: false, msg: "unautherized user" }) }

        next()
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}