import React from 'react';

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

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId?: number;
  isActive: boolean;
  onClick: () => void;
  lastMessageDate: string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
  isActive,
  onClick,
  lastMessageDate
}) => {
  const otherUser = currentUserId === conversation.user1.id ? conversation.user2 : conversation.user1;

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        isActive ? 'bg-green-50 border-r-4 border-green-500' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {otherUser.name}
            </h3>
            <span className="text-xs text-gray-500 shrink-0">
              {lastMessageDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 truncate">
              {/* Last message preview would go here */}
            </p>
            {/* Unread count badge */}
            {/* <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center ml-2">
              2
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;