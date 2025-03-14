"use client";
import { useEffect, useState , useRef} from "react";
import { useSocket } from "../contexts/useSocket";
import axios from "axios";

const Chat = ({ customerId }) => {
  const socket = useSocket();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasChatStarted = useRef(false);

  useEffect(() => {
    const startChat = async () => {
      try {

        if (hasChatStarted.current || chatId) return;
        
        setLoading(true);
        hasChatStarted.current = true; // Mark that we've started the chat process
        
        const { data } = await axios.post(
          "http://localhost:3000/message/start",
          {},
          { withCredentials: true }
        );
        
        const newChatId = data.data._id;
        if (!newChatId) throw new Error("Failed to get chat ID");
        
        setChatId(newChatId);
        
        const prevMessageResponse = await axios.get(
          "http://localhost:3000/message/",
          { withCredentials: true }
        );
        
        let chatMessages = [];
        if (Array.isArray(prevMessageResponse.data.messages.messages)) {
          chatMessages = prevMessageResponse.data.messages.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp || new Date().toISOString()
          }));
        }
        
        setMessages(chatMessages);
        socket?.emit("joinChat", newChatId);
      } catch (error) {
        console.error("Error starting chat:", error);
        setError(error.response?.data?.message || "Failed to connect to chat.");
        hasChatStarted.current = false; 
      } finally {
        setLoading(false);
      }
    };
  
  
    if (!chatId) {
      startChat()};
    
    // Cleanup function to reset the ref when component unmounts
    return () => {
      hasChatStarted.current = false;
    };
  }, [chatId, socket]); // Added dependencies that are used in the effect

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (message) => {
      // Only add messages from the server (not from this client)
      if (message.sender !== "client" || message._id) {
        const messageWithTimestamp = {
          ...message,
          timestamp: message.timestamp || new Date().toISOString()
        };
        setMessages((prev) => [...prev, messageWithTimestamp]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("receiveMessage", handleNewMessage);
   
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket, chatId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !chatId) return;
  
    const messageData = {
      chatId,
      sender: "client",
      text: newMessage,
      timestamp: new Date().toISOString(),
      // Add a temporary ID to identify this message locally
      tempId: Date.now().toString()
    };
  
    // Add message to local state immediately for responsive UI
    setMessages((prev) => [...prev, messageData]);
    
    // Send message to server
    socket?.emit("sendMessage", messageData);
    
    // Clear input field
    setNewMessage("");
  };
  
  // Format a date consistently for grouping
  const formatDateForGrouping = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format a time consistently for display
  const formatTimeForDisplay = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Time";
    
    return date.toLocaleTimeString('en-US', { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const date = formatDateForGrouping(msg.timestamp);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(msg);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-96 border border-gray-300 rounded-lg shadow-md bg-white">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Customer Support</h2>
        <span className="text-sm bg-green-500 px-2 py-1 rounded-full">
          {loading ? "Connecting..." : "Online"}
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Connecting to support...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              <div className="text-center text-gray-500 text-sm my-2">{date}</div>
              {groupedMessages[date].map((msg, index) => (
                <div
                  key={msg._id || msg.tempId || index}
                  className={`mb-3 max-w-3/4 ${msg.sender === "client" ? "ml-auto" : "mr-auto"}`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === "client"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`text-xs mt-1 text-gray-500 ${
                      msg.sender === "client" ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTimeForDisplay(msg.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-300 bg-white rounded-b-lg">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading || !chatId}
           
          />
          <button
            onClick={sendMessage}
            disabled={loading || !chatId || !newMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;