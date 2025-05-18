
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { LoginAlerts } from "./LoginAlerts";
import { LoginFormFields } from "./LoginFormFields";
// TestAccountsSection ya no se importa
import { handleLogin, testDirectConnection } from "./utils/authUtils";

interface LoginFormProps {
  from?: string;
}

export const LoginForm = ({ from = "/dashboard" }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loginAttemptCount, setLoginAttemptCount] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(
      email, 
      password, 
      loginAttemptCount, 
      setLoginAttemptCount, 
      setIsLoading, 
      setErrorMessage, 
      setInfoMessage, 
      login, 
      navigate, 
      from
    );
  };

  // La función fillTestAccount ya no es necesaria
  // const fillTestAccount = (testEmail: string) => { ... }

  const handleTestConnection = async () => {
    await testDirectConnection(setIsLoading, setErrorMessage, setInfoMessage);
  };

  return (
    <>
      <LoginAlerts 
        errorMessage={errorMessage} 
        infoMessage={infoMessage} 
      />
      
      <LoginFormFields 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onTestConnection={handleTestConnection}
      />
      
      {/* TestAccountsSection ya no se renderiza aquí */}
      {/* <TestAccountsSection onSelectAccount={fillTestAccount} /> */}
    </>
  );
};
