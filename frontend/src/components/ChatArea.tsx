import React, { useEffect, useRef } from 'react';
import { MoreVertical, Phone, Video, Search, MessageCircle } from 'lucide-react';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
  senderId?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Conversation {
  id: string;
  createdAt: string;
  user1: User;
  user2: User;
}

interface ChatAreaProps {
  activeConversation?: Conversation | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  currentUser: User | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  activeConversation,
  messages,
  onSendMessage,
  currentUser
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  const otherUser = currentUser?.id === activeConversation.user1.id ? 
    activeConversation.user2 : 
    activeConversation.user1;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
              <p className="text-sm text-gray-500">
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation with {otherUser.name}</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem 
              key={message.id} 
              message={message}
              isCurrentUser={message.senderId === currentUser?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;