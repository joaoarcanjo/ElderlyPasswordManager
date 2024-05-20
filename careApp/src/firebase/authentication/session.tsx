import { ReactNode, createContext, useContext, useState } from "react"
import React from 'react';
import { emptyValue } from "../../assets/constants/constants";

interface LoginContextProps {
    children: ReactNode;
  }
  
  const LoginContext = createContext<{
    userEmail: string
    userName: string
    userPhone: string
    userId: string
    localDBKey: string
    usernameCopied: string
    passwordCopied: string
    setUserPhone: (payload: string) => void
    setUserEmail: (payload: string) => void
    setUserName: (payload: string) => void
    setUserId: (payload: string) => void
    setLocalDBKey: (payload: string) => void
    setPasswordCopied: (payload: string) => void
    setUsernameCopied: (payload: string) => void
  } | undefined>(undefined);
  
  const SessionProvider: React.FC<LoginContextProps> = ({ children }) => {

    const [userEmail, setUserEmail] = useState(emptyValue)
    const [userPhone, setUserPhone] = useState(emptyValue)
    const [userName, setUserName] = useState(emptyValue)
    const [userId, setUserId] = useState(emptyValue)
    const [localDBKey, setLocalDBKey] = useState(emptyValue)
    const [usernameCopied, setUsernameCopied] = useState(emptyValue)
    const [passwordCopied, setPasswordCopied] = useState(emptyValue)
  
    return (
      <LoginContext.Provider 
          value={{ 
            userEmail, 
            userName, 
            userPhone, 
            userId, 
            localDBKey, 
            usernameCopied,
            passwordCopied,
            setUserPhone, 
            setUserEmail, 
            setUserName, 
            setUserId,
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