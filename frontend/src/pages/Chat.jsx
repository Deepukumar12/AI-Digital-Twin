import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { Send, User, Bot, Loader } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I am your AI Career Mentor. I've analyzed your Digital Twin profile. How can I help you reach your goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Build history payload for OpenAI (excluding system prompt as backend injects it)
      const historyPayload = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await api.post('/chat', {
        message: userMessage,
        history: historyPayload
      });

      setMessages([...newMessages, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-primary-50 flex items-center">
        <Bot className="h-6 w-6 text-primary-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Personalized Career Mentor</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary-600 ml-3' : 'bg-green-600 mr-3'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[80%]">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 mr-3 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl shadow-sm bg-white border border-gray-200 text-gray-800 rounded-tl-none flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500">Mentor is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex space-x-4">
          <input
            type="text"
            className="flex-1 focus:ring-primary-500 focus:border-primary-500 block w-full rounded-full sm:text-sm border-gray-300 px-4 py-3 border bg-gray-50"
            placeholder="Ask about interview prep, skill gaps, or career steps..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
