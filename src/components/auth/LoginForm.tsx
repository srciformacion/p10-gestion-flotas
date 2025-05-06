
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoginAlerts } from "./LoginAlerts";
import { LoginFormFields } from "./LoginFormFields";
import { TestAccountsSection } from "./TestAccountsSection";
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

  const fillTestAccount = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("123456");
    setErrorMessage(null);
    setInfoMessage(`Cuenta de prueba seleccionada: ${testEmail}. Haz clic en "Iniciar sesión" para continuar.`);
  };

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
      
      <TestAccountsSection onSelectAccount={fillTestAccount} />
    </>
  );
};
