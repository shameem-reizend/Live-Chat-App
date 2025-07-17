import React, { useEffect, useState } from 'react';
import { Search, MessageCircle, LogOut } from 'lucide-react';
import ConversationItem from './ConversationItem';
import axios from 'axios';
import { AddUserButton } from './AddUserButton';
import { useNavigate } from 'react-router-dom';

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

interface ConversationSidebarProps {
  onConversationSelect: (conversation: Conversation) => void;
  activeConversationId: string | null | undefined;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  onConversationSelect,
  activeConversationId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const Navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:4000/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchAllConversations = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:4000/conversation", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setConversations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAllConversations();
  }, []);

  const filteredConversations = conversations.filter(conv => 
    searchTerm ? 
      (currentUser?.id === conv.user1.id ? 
        conv.user2.name.toLowerCase().includes(searchTerm.toLowerCase()) :
        conv.user1.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) : true
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

   const handleNewConversation = (newConversation: Conversation) => {
    setConversations(prev => [newConversation, ...prev]);
    onConversationSelect(newConversation);
  };

  const handleLogout = async () => {
    const response = await axios.get("http://localhost:4000/auth/logout");
    console.log(response);
    localStorage.clear();
    Navigate('/login');
  }

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-green-500" />
            Chats
          </h1>
          <LogOut onClick={handleLogout}/>
          <AddUserButton onNewConversation={handleNewConversation} />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="animate-pulse flex space-x-4 p-4 w-full">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              currentUserId={currentUser?.id}
              isActive={activeConversationId === conversation.id}
              onClick={() => onConversationSelect(conversation)}
              lastMessageDate={formatDate(conversation.createdAt)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;