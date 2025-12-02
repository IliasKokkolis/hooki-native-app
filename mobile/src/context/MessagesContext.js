import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const MessagesContext = createContext({});

export const MessagesProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setConversations([]);
    }
  }, [user?.id]); // Reload when user changes

  const loadConversations = async () => {
    try {
      const stored = await AsyncStorage.getItem(`conversations_${user.id}`);
      if (stored) {
        setConversations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConversations = async (newConversations) => {
    try {
      await AsyncStorage.setItem(
        `conversations_${user.id}`,
        JSON.stringify(newConversations)
      );
      setConversations(newConversations);
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  const sendMessage = async (recipientId, recipientName, text) => {
    const message = {
      id: Date.now().toString(),
      senderId: user.id,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Find or create conversation
    let newConversations = [...conversations];
    const convIndex = newConversations.findIndex(
      (c) => c.userId === recipientId
    );

    if (convIndex >= 0) {
      // Update existing conversation
      newConversations[convIndex].messages.push(message);
      newConversations[convIndex].lastMessage = text;
      newConversations[convIndex].lastMessageTime = message.timestamp;
    } else {
      // Create new conversation
      newConversations.push({
        userId: recipientId,
        userName: recipientName,
        messages: [message],
        lastMessage: text,
        lastMessageTime: message.timestamp,
        unreadCount: 0,
      });
    }

    // Sort by most recent
    newConversations.sort(
      (a, b) =>
        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    await saveConversations(newConversations);
  };

  const markAsRead = async (userId) => {
    const newConversations = conversations.map((conv) => {
      if (conv.userId === userId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map((msg) => ({ ...msg, read: true })),
        };
      }
      return conv;
    });
    await saveConversations(newConversations);
  };

  const getConversation = (userId) => {
    return conversations.find((c) => c.userId === userId);
  };

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        loading,
        sendMessage,
        markAsRead,
        getConversation,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);

