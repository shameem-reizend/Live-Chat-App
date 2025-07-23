import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ConversationSidebar from './ConversationSidebar';
import ChatArea from './ChatArea';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import API from '../axios';

interface Message {
  id: string;
  text: string | Blob;
  type: string
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
  senderId: number;
  receiverId: number;
  conversationId: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  lastSeen: string | Date;
}

interface Conversation {
  id: string;
  createdAt: string;
  user1: User;
  user2: User;
  lastMessage: string;
  lastMessageDate: string;
}

export const Home: React.FC = () => {

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [receiverId, setReceiverId] = useState(0);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const Navigate = useNavigate();

  
  useEffect(() => {
    const fetchCurrentUserAndConnect = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const user = response.data;
        setCurrentUser(user);

        const newSocket = io(`${BASE_URL}`, {
          withCredentials: true,
          auth: {
            token: accessToken,
          },
          query: {
            userId: user.id,
          },
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
          console.log("Connected to socket server with userId:", user.id);
        });

        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUserAndConnect();
  }, []);

  const handleLogout = async () => {
    const response = await API.get("/auth/logout");
    console.log(response);
    localStorage.clear();
    googleLogout();
    socket?.disconnect();
    Navigate('/login');
  }


  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const messages = await response.json();
      if (currentUser) {
        const formattedMessages = messages.map((msg: Message) => ({
          ...msg,
          isSent: msg.senderId === currentUser.id
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const readMessage = async (conversationId: string, userId: number) => {
    
    const response = await API.post(`/messages/read`, {
      conversationId: conversationId,
      userId: userId
    })
   
  }

  const handleConversationSelect = async (conversation: Conversation) => {
    if (!socket || !currentUser) {
      return;
    }

    setReceiverId(conversation.user2.id);
    setActiveConversation(conversation);

    await fetchMessages(conversation.id);
    await readMessage(conversation.id, conversation.user2.id);
    
    socket.emit('join_room', conversation.id);

    socket.off('receive_message'); 
    socket.on('receive_message', (data) => {
      console.log(data.message);
      setMessages(prev => [...prev, {
        ...data.message,
        isSent: data.senderId === currentUser.id
      }]);
    });
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject('Failed to convert blob to base64.');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };


  const handleSendMessage = async (message: string | Blob) => {
    if (!activeConversation || !socket || !currentUser) return;

    const now = new Date();
    const isoTime = now.toISOString();
    const displayTime = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    let newMessage = {}

    if(typeof(message) == 'string'){
      
      newMessage = {
        id: Date.now().toString(),
        text: message,
        type: 'text',
        timestamp: isoTime,
        isSent: true,
        isRead: false,
        senderId: currentUser.id,
        receiverId: receiverId,
        conversationId: activeConversation.id
      };
    } else {
      const base64String = await blobToBase64(message);

      newMessage = {
        id: Date.now().toString(),
        text: base64String,
        type: 'file',
        timestamp: isoTime,
        isSent: true,
        isRead: false,
        senderId: currentUser.id,
        receiverId: receiverId,
        conversationId: activeConversation.id
      };
    }
    

    const displayMessage = { ...newMessage, timestamp: displayTime };
    setMessages(prev => [...prev, displayMessage]);

    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(newMessage)
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      socket.emit('send_message', {
        room: activeConversation.id,
        message: displayMessage,
        senderId: currentUser.id,
        receiverId: receiverId
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-full max-w-100 bg-white shadow-lg flex h-screen">
        <ConversationSidebar 
          onConversationSelect={handleConversationSelect}
          activeConversationId={activeConversation?.id}
          handleLogout = {handleLogout}
        />
        <ChatArea
          activeConversation={activeConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};