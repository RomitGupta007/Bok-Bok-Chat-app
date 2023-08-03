const express = require('express')
const Router = express.Router();
const {registerUser, authUser, allUsers} = require("../controllers/userControllers");
const { protect } = require('../middleware/authMiddleware');

Router.route('/').post(registerUser).get(protect,allUsers)
Router.post('/login',authUser)


module.exports = Router