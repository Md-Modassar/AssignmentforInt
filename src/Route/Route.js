const exprees = require('express');
const router = exprees.Router();

const { createUser, updateUser, login, deleteuser, getuser, getusers } = require('../Controller/userController')
const { authentication, authrization } = require("../middelwear/auth")
router.post("/user", createUser)
router.post("/login", login)
router.put("/user/:userId", authentication, authrization, updateUser)
router.delete("/user/:userId", authentication, authrization, deleteuser)
router.get("/user/:userId", authentication, getuser)
router.get("/users", authentication, getusers)

module.exports = router;