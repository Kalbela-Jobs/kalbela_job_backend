const { ObjectId } = require("mongodb");
const { user_collection } = require("../../collection/collections/auth");
const { chat_collection } = require("../../collection/collections/users_activity");
const { response_sender } = require("../hooks/respose_sender");

const add_new_chat = async (req, res, next) => {
      try {
            let body = req.body;
            body.created_at = new Date();
            body.updated_at = new Date();
            const chat = await chat_collection.insertOne(body);
            response_sender({
                  res,
                  status_code: 201,
                  error: false,
                  message: "Chat added successfully",
                  data: chat,
            });
      } catch (error) {
            next(error);
      }
}

const get_chat_by_user = async (req, res, next) => {
      try {
            const { sender, to } = req.query;
            if (!sender || !to) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Sender and recipient ID are required",
                  });
            }

            const chats = await chat_collection.find({
                  $or: [
                        { sender, to },
                        { sender: to, to: sender }
                  ]
            }).sort({ created_at: 1 }).toArray();



            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Chats fetched successfully",
                  data: chats,
            });
      } catch (error) {
            next(error);
      }
};

const get_all_messaged_users = async (req, res, next) => {
      try {
            const user_id = req.query.user_id;

            const messages = await chat_collection
                  .find({
                        $or: [{ sender: user_id }, { to: user_id }]
                  })
                  .sort({ timestamp: -1 }) // Get the latest messages first
                  .toArray();


            const userIds = [
                  ...new Set(messages.flatMap(m => [m.sender, m.to]))
            ]
                  .filter(id => id !== user_id)
                  .map(id => new ObjectId(id)); // Convert each ID to ObjectId




            const users = await user_collection
                  .find({ _id: { $in: userIds } }, { projection: { _id: 1, name: 1, profile_picture: 1, fullName: 1 } })
                  .toArray();


            const formattedUsers = await Promise.all(

                  users.map(async user => {

                        const userMessages = messages.filter(
                              m => m.sender === user._id.toString() || m.to === user._id.toString()
                        );
                        // Get the last message
                        const lastMessage = userMessages[0] || {};

                        // Check if message is empty, audio, or has attachments
                        let lastMessageContent = lastMessage.content || ''; // Default to empty string
                        let last_message_time = lastMessage.created_at;
                        let attachmentPreview = '';
                        let audioPreview = '';

                        // If no content and attachments exist, show the first attachment (image preview)
                        if (!lastMessageContent && lastMessage.attachments && lastMessage.attachments.length > 0) {
                              attachmentPreview = lastMessage.attachments[0]; // Assuming first attachment is an image
                              lastMessageContent = 'Sent an attachment';
                        } else if (!lastMessageContent && lastMessage.audio) {
                              audioPreview = lastMessage.audio;
                              lastMessageContent = 'Sent an audio message';
                        }

                        // Determine the message status (seen or delivered)
                        const messageStatus = lastMessage.status === 'seen' ? 'Seen' : 'Delivered';

                        return {
                              user_id: user._id,
                              fullName: user.name ?? user.fullName,
                              profile_picture: user.profile_picture,
                              lastMessage: lastMessageContent,
                              lastMessageStatus: messageStatus,
                              lastMessageTime: last_message_time,
                              attachmentPreview: attachmentPreview, // Attachment preview (image)
                              audioPreview: audioPreview // Audio preview link
                        };
                  })
            );

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: 'Messaged users fetched successfully',
                  data: formattedUsers.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
            });
      } catch (error) {
            next(error);
      }
};







module.exports = { add_new_chat, get_chat_by_user, get_all_messaged_users };
