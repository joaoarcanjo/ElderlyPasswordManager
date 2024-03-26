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
    userFireKey: string
    localDBKey: string
    usernameCopied: string
    passwordCopied: string
    setUserPhone: (payload: string) => void
    setUserEmail: (payload: string) => void
    setUserName: (payload: string) => void
    setUserId: (payload: string) => void
    setUserFireKey: (payload: string) => void
    setLocalDBKey: (payload: string) => void
    setPasswordCopied: (payload: string) => void
    setUsernameCopied: (payload: string) => void
  } | undefined>(undefined);
  
  const SessionProvider: React.FC<LoginContextProps> = ({ children }) => {

    const [userEmail, setUserEmail] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [userName, setUserName] = useState('')
    const [userId, setUserId] = useState('')
    const [userFireKey, setUserFireKey] = useState('')
    const [localDBKey, setLocalDBKey] = useState('')
    const [usernameCopied, setUsernameCopied] = useState('')
    const [passwordCopied, setPasswordCopied] = useState('')
  
    return (
      <LoginContext.Provider 
          value={{ 
            userEmail, 
            userName, 
            userPhone, 
            userId,  
            userFireKey, 
            localDBKey, 
            usernameCopied,
            passwordCopied,
            setUserPhone, 
            setUserEmail, 
            setUserName, 
            setUserId, 
            setUserFireKey, 
            setLocalDBKey,
            setUsernameCopied,
            setPasswordCopied
            }}>
        {children}
      </LoginContext.Provider>
    );
  };
  
  const useSessionInfo = () => {
    const context = useContext(LoginContext);
    if (!context) {
      throw new Error('useSessionInfo tem que ser utilizado dentro de um SessionProvider');
    }
    return context;
  };
  
  export { SessionProvider, useSessionInfo };