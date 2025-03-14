"use client"
import { useState } from "react";
import Chat from "./Chat";


const ChatWidget = ({ customerId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "12px",
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        </div>

      {/* Chat Dialog */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "10px",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px",
              fontSize: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Chat Support</span>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              ✖
            </button>
          </div>

          {/* Chat Content */}
          <Chat customerId={customerId} />
        </div>
      )}
    </>
  );
};

export default ChatWidget;
