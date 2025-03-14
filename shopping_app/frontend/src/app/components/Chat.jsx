import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import axios from "axios";

const Chat = ({ customerId }) => {
  const socket = useSocket();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");


  useEffect(() => {
    const startChat = async () => {
      try {
        const { data } = await axios.post("http://localhost:5000/api/chat/start", { customerId });
        setChatId(data._id);
        setMessages(data.messages);
        socket?.emit("joinChat", { chatId: data._id });
      } catch (error) {
        console.error("Error starting chat:", error);
      }
    };

    startChat();
  }, [customerId, socket]);

  // Receive real-time messages
  useEffect(() => {
    if (!socket || !chatId) return;

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, chatId]);

  // Send a message
  const sendMessage = () => {
    if (!newMessage.trim() || !chatId) return;

    const messageData = { chatId, senderId: customerId, text: newMessage };
    socket?.emit("sendMessage", messageData);
    setNewMessage("");
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#fff" }}>
      <h2>Chat Support</h2>
      <div style={{ height: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "5px", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender === customerId ? "You" : "Agent"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "5px" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "5px", padding: "5px 10px", backgroundColor: "blue", color: "white" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
