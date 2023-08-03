const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChats, fetchChats, createGroupChats, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatControllers');
const Router = express.Router();

Router.route('/').post(protect , accessChats)
Router.route('/').get(protect , fetchChats)
Router.route('/group').post(protect , createGroupChats)
Router.route('/rename').put(protect , renameGroup)
Router.route('/groupadd').put(protect , addToGroup)
Router.route('/groupremove').put(protect , removeFromGroup)

module.exports = Router