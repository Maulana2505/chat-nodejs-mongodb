import Conversation from "../model/conversation.model.js"
import Message from "../model/massage.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user.id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}
		await Promise.all([conversation.save(), newMessage.save()]);
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}
		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}


export const getMessages = async (req, res) => {
	try {
		const senderId = req.user.id
		const conversation = await Conversation.find({
			participants: { $all: [senderId] }
		}).populate("messages").populate("participants", 'username profilepic')
		if (!conversation) return res.status(200).json([])
		res.status(200).json(conversation)
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: "Internal Server Error" })
	}
}



export const deleteMessages = async (req, res) => {
	try {
		const idparams = req.params.id
		const dm = await Message.findByIdAndDelete({ _id: idparams })
		res.status(200).json(dm)
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: "Internal Server Error" })
	}
}

