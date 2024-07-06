import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import "./App.css";
import Logo from './Image/mobile-chat.png';
import SendLogo from './Image/send.png';

const socket = io('http://localhost:3000'); // Ensure this URL is correct

function App() {
  const [messages, setMessages] = useState([]); // Initialize as an empty array
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, { ...message, self: false }]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message = { text: newMessage, self: true };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit('sendMessage', message);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-[90%] h-[90vh] bg-sky-100 rounded-lg flex flex-col justify-between items-center p-4 md:w-[70%] lg:w-[50%]">
        <img src={Logo} alt="logo" className="w-[40px] h-[40px] mb-3 rounded-full" />
        <div className="w-full h-full bg-slate-100 rounded-lg overflow-y-auto p-4 flex flex-col">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-auto max-w-[80%] rounded-lg p-2 mb-2 ${
                message.self ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'
              }`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="w-full flex mt-4">
          <input
            type="text"
            placeholder="Enter A Message"
            className="flex-grow h-[50px] bg-white rounded-lg p-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="w-[20%] h-[50px] bg-blue-500 text-white flex justify-center items-center rounded-lg ml-2 md:w-[15%] lg:w-[10%]"
            onClick={handleSend}
          >
            <img src={SendLogo} alt="send" className="w-[20px] h-[20px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
