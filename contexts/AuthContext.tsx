import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role, additionalData?: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock initial users
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'u_demo_survivor',
    name: 'Alex Doe',
    email: 'survivor@demo.com',
    password: 'password',
    role: 'survivor',
    alias: 'User_7392',
  },
  {
    id: 'u_demo_supporter',
    name: 'Dr. Sarah Smith',
    email: 'sarah@clinic.com',
    password: 'password',
    role: 'supporter',
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUsers, setDbUsers] = useState(MOCK_USERS);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (foundUser) {
      // Create session user without password
      const { password: _, ...sessionUser } = foundUser;
      setUser(sessionUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: Role, additionalData?: any): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if email exists
    if (dbUsers.some(u => u.email === email)) {
      return false; // Email taken
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      password,
      role,
      alias: additionalData?.alias,
      // For supporters, we might store extra fields in a real DB
      ...additionalData
    };

    setDbUsers([...dbUsers, newUser]);
    
    // Auto login
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};