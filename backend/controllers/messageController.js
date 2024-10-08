import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.message.push(newMessage._id);
    }

    await conversation.save();
    await newMessage.save();

    return res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log("MESSAGE CONTROLLER SEND MESSAGE CATCH");
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await conversationModel.find({
        participants: {$all : [senderId, receiverId]}
    })

    if(!conversation){
        return res.json({
            success: true,
            messages: []
        })
    }

    return res.json({
        success: true,
        messages : conversation.message
    })    

  } catch (error) {
    console.log("MESSAGE CONTROLLER GET MESSAGE CATCH");
  }
};