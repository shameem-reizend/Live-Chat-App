import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UnreadCountContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const UnreadCountContext = createContext<UnreadCountContextType | undefined>(undefined);

export const UnreadCountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  return (
    <UnreadCountContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadCountContext.Provider>
  );
};

export const useUnreadCount = () => {
  const context = useContext(UnreadCountContext);
  if (!context) {
    throw new Error('useUnreadCount must be used within UnreadCountProvider');
  }
  return context;
};