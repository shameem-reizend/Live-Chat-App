import React from 'react';

interface Message {
  id: string;
  text: string;
  type: string
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
}

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'} px-2`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${
        isCurrentUser ? 'items-end' : 'items-start'
      }`}>
        <div className={`px-4 py-2 rounded-lg break-words ${
          isCurrentUser 
            ? 'bg-green-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}>
          {message.type === 'file' ? <img src = {message.text} /> 
          : <p className="whitespace-pre-wrap word-break break-word">
              {message.text}
            </p>
          }      
          
          <div className={`text-xs mt-1 flex items-center justify-end ${
            isCurrentUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp}
            {isCurrentUser && (
              <span className="ml-1">
                {message.isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;