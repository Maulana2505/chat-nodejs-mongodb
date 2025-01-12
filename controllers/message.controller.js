import Conversation from "../model/conversation.model.js";
import Message from "../model/massage.model.js";
import {
  getReceiverSocketId,
  getSenderSocketId,
  io,
} from "../socket/socket.js";
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getSenderSocketId(senderId);
    
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
      io.to(receiverSocketId).emit("newMessage2", newMessage);
      io.to(senderSocketId).emit("newMessage2", newMessage);
    }
    
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    io.to(receiverSocketId).emit("newMessage", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.user.id;
    const conversation = await Conversation.find({
      participants: { $all: [senderId] },
    })
      .populate("messages")
      .populate("participants", "username profilepic");
    if (!conversation) return res.status(200).json([]);
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages2 = async (req, res) => {
  try {
    const senderId = req.user.id;
    const conversation = await Conversation.find({
      participants: { $all: [senderId] },
    })
      .populate({ path: "messages", options: { sort: { createdAt: -1 } } })
      .populate("participants", "username");
    if (conversation.length === 0) {
      return res.status(200).json([]);
    }
    const user = conversation.map((conversations) => ({
      participants: conversations.participants.filter(
        (participant) => senderId != participant._id
      ),
      msg: conversations.messages[0],
    }));
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessageswithparams = async (req, res) => {
  try {
    const id = req.params.id;
    const senderId = req.user.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, id] },
    })
      .sort({ "messages.createdAt": "asc" })
      .populate("messages");
    // .sort({"messages.createdAt":-1}).exec();

    if (!conversation) return res.status(200).json([]);
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteMessages = async (req, res) => {
  try {
    const idparams = req.params.id;
    const dm = await Message.findByIdAndDelete({ _id: idparams });
    res.status(200).json(dm);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
