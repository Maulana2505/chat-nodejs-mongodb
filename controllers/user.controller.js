import Conversation from "../model/conversation.model.js"
import User from "../model/user.model.js"

export const findUser = async (req, res) => {
    try {
        const userid = req.user.id
        const name = req.params.username;
        const user = await User.find({ $and: [{ _id: { $ne: userid } }, { username: { $regex: name } }] })

        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getFindMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages")
        // if (!conversation) return res.status(200).json([])
        res.status(200).json(conversation)
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


