import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { User, UserRole } from '../models/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: UserRole, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  loginDemo: (role?: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = '@eventhub_token';
const USER_STORAGE_KEY = '@eventhub_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved session on initial app open
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } else {
          // Default preloaded guest/demo session for immediate instant interaction
          const defaultDemoUser: User = {
            id: 'demo-user-1',
            _id: 'demo-user-1',
            name: 'Alex Rivera',
            email: 'alex.rivera@example.com',
            role: 'organizer',
            phone: '+94 77 987 6543',
            bio: 'Tech enthusiast & event explorer.',
            avatar: 'https://api.dicebear.com/7.x/bottts/png?seed=Alex',
          };
          setUser(defaultDemoUser);
          setToken('mock_demo_jwt_token_2026');
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultDemoUser));
          await AsyncStorage.setItem(TOKEN_STORAGE_KEY, 'mock_demo_jwt_token_2026');
        }
      } catch (e) {
        console.error('Failed to restore auth session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token: receivedToken, user: receivedUser } = response.data;

        setToken(receivedToken);
        setUser(receivedUser);

        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(receivedUser));
      } catch (networkError) {
        console.log('Backend offline, logging in locally');
        const localUser: User = {
          id: `usr-${Date.now()}`,
          _id: `usr-${Date.now()}`,
          name: email.split('@')[0] || 'Member',
          email,
          role: email.includes('organizer') ? 'organizer' : 'attendee',
          avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(email)}`,
        };
        const localToken = `mock_token_${Date.now()}`;
        setToken(localToken);
        setUser(localUser);
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, localToken);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'attendee',
    phone: string = ''
  ) => {
    setIsLoading(true);
    try {
      try {
        const response = await api.post('/auth/signup', { name, email, password, role, phone });
        const { token: receivedToken, user: receivedUser } = response.data;

        setToken(receivedToken);
        setUser(receivedUser);

        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(receivedUser));
      } catch (networkError) {
        console.log('Backend offline, signing up locally');
        const localUser: User = {
          id: `usr-${Date.now()}`,
          _id: `usr-${Date.now()}`,
          name,
          email,
          role,
          phone,
          avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(name)}`,
        };
        const localToken = `mock_token_${Date.now()}`;
        setToken(localToken);
        setUser(localUser);
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, localToken);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...userData };
    setUser(updated);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));

    try {
      await api.put('/auth/profile', userData);
    } catch (e) {
      console.log('Updated profile locally');
    }
  };

  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    await updateUser({ role: newRole });
  };

  const loginDemo = async (role: UserRole = 'attendee') => {
    const demoUser: User = {
      id: role === 'organizer' ? 'org-demo-1' : 'att-demo-1',
      _id: role === 'organizer' ? 'org-demo-1' : 'att-demo-1',
      name: role === 'organizer' ? 'Sarah Jenkins (Host)' : 'John Doe (Attendee)',
      email: role === 'organizer' ? 'sarah.host@eventhub.com' : 'john.doe@eventhub.com',
      role,
      phone: '+94 77 123 4567',
      bio: role === 'organizer' ? 'Senior Event Director & Conference Producer.' : 'Passionate music and tech enthusiast.',
      avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${role}`,
    };
    setUser(demoUser);
    setToken('mock_demo_jwt_token_2026');
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, 'mock_demo_jwt_token_2026');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isOrganizer: user?.role === 'organizer',
        login,
        signup,
        logout,
        updateUser,
        switchRole,
        loginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
