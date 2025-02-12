const express = require('express');
const { add_new_chat, get_chat_by_user, get_all_messaged_users } = require('./Chat_module');
const { verifyJWT } = require('../midileware/midileware');
const router = express.Router();

router.post('/add-new-chat', verifyJWT, add_new_chat)
router.get('/get-chat-by-user', verifyJWT, get_chat_by_user)
router.get('/get-all-messaged-users', verifyJWT, get_all_messaged_users)

module.exports = router;
