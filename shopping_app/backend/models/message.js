const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "suser", required: true },
    agent: { type: String, required: true  }, 
    messages: [
      {
        sender: { type: String, enum: {values: ['client', 'care']} },
        text: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;