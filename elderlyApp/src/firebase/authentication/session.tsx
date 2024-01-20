import { ReactNode, createContext, useContext, useState } from "react"
import React from 'react';

interface LoginContextProps {
    children: ReactNode;
  }
  
  const LoginContext = createContext<{
    userEmail: string
    userName: string
    userPhone: string
    userId: string
    userShared: string
    localDBKey: string
    setUserPhone: (payload: string) => void
    setUserEmail: (payload: string) => void
    setUserName: (payload: string) => void
    setUserId: (payload: string) => void
    setShared: (payload: string) => void
    setLocalDBKey: (payload: string) => void
  } | undefined>(undefined);
  
  const LoginProvider: React.FC<LoginContextProps> = ({ children }) => {

    const [userEmail, setUserEmail] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [userName, setUserName] = useState('')
    const [userId, setUserId] = useState('')
    const [userShared, setShared] = useState('')
    const [localDBKey, setLocalDBKey] = useState('')
  
    return (
      <LoginContext.Provider value={{ userEmail, userName, userPhone, userId, userShared, localDBKey, setUserPhone, setUserEmail, setUserName, setUserId, setShared, setLocalDBKey }}>
        {children}
      </LoginContext.Provider>
    );
  };
  
  const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) {
      throw new Error('useLogin tem que ser utilizado dentro de um LoginProvider');
    }
    return context;
  };
  
  export { LoginProvider, useLogin };