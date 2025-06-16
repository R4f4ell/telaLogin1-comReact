import React from 'react';
import '../styles/main.scss';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';

const LoginForm = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    message,
    messageType,
    errors,
    validate
  } = useLoginForm();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;
  };

  return (
    <main className="login-page">
      <motion.div
        className="login-form"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="login-form__title">Login</p>

        {message && (
          <p
            className={`login-form__message login-form__message--${messageType}`}
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <form className="login-form__form" onSubmit={handleLogin}>
          <div className="login-form__group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              minLength="3"
              maxLength="30"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <p className="login-form__error">{errors.username}</p>
            )}
          </div>

          <div className="login-form__group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              minLength="8"
              maxLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="login-form__error">{errors.password}</p>
            )}
            <div className="login-form__forgot">
              <a href="#">Forgot Password?</a>
            </div>
          </div>

          <button type="submit" className="login-form__button">
            Sign in
          </button>
        </form>

        <div className="login-form__social-message">
          <div className="line"></div>
          <p className="message">Login with social accounts</p>
          <div className="line"></div>
        </div>

        <div className="login-form__social-icons">
          <button className="icon" aria-label="Login com Google">
            <Mail size={32} strokeWidth={1.5} />
          </button>
          <button className="icon" aria-label="Login com Twitter">
            <Twitter size={32} />
          </button>
          <button className="icon" aria-label="Login com GitHub">
            <Github size={32} />
          </button>
        </div>

        <p className="login-form__signup">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </motion.div>
    </main>
  );
};

export default LoginForm;