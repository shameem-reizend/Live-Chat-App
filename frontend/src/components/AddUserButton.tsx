import { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';

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

interface AddUserButtonProps {
  onNewConversation: (conversation: Conversation) => void;
}

export const AddUserButton = ({ onNewConversation }: AddUserButtonProps) =>  {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    fetchUsers();
  };

  const handleStartConversation = async (userId: number) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/conversation", 
        { user2: userId }, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          } 
        }
      );
      const newConversation = response.data;
      onNewConversation(newConversation); // This will update the parent state
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error creating conversation:", error);
      setError("Failed to start conversation");
    }
  };


  return (
    <>
      <button 
        onClick={openModal}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-600" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Registered Users</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-gray-500 py-4">No users found</p>
                ) : (
                  users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => handleStartConversation(user.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Message
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}