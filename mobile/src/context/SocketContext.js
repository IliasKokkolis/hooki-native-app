import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('join_user', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

