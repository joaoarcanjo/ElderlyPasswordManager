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
    setUserPhone: (payload: string) => void
    setUserEmail: (payload: string) => void
    setUserName: (payload: string) => void
    setUserId: (payload: string) => void
  } | undefined>(undefined);
  
  const LoginProvider: React.FC<LoginContextProps> = ({ children }) => {

    const [userEmail, setUserEmail] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [userName, setUserName] = useState('')
    const [userId, setUserId] = useState('')
  
    return (
      <LoginContext.Provider value={{ userEmail, userName, userPhone, userId, setUserPhone, setUserEmail, setUserName, setUserId }}>
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