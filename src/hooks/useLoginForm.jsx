import { useState, useCallback, useMemo } from 'react';

// Hook personalizado 
export function useLoginForm() {
  // Estados dos campos
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Mensagem de sucesso ou erro
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Erros específicos de cada campo
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  // Função que valida os campos
  const validate = useCallback(() => {
    const newErrors = { username: '', password: '' };
    let hasError = false;

    if (username.trim().length < 3) {
      newErrors.username = 'Usuário deve ter pelo menos 3 caracteres.';
      hasError = true;
    }

    if (password.trim().length !== 8) {
      newErrors.password = 'A senha deve ter exatamente 8 caracteres.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setMessage('');
      setMessageType('error');
      return false;
    }

    setErrors({ username: '', password: '' });
    setMessage(`Bem-vindo, ${username}!`);
    setMessageType('success');
    return true;
  }, [username, password]);

  return useMemo(
    () => ({
      username,
      setUsername,
      password,
      setPassword,
      message,
      messageType,
      errors,
      validate,
    }),
    [username, password, message, messageType, errors, validate]
  );
}
