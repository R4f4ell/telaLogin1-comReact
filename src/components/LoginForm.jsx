import React, { memo, useCallback, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Github, Twitter, Mail } from 'lucide-react'
import { useLoginForm } from '../hooks/useLoginForm'
import './loginForm.scss';

const LoginForm = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    message,
    messageType,
    errors,
    validate,
    clearFieldError,
  } = useLoginForm()

  const prefersReducedMotion = useReducedMotion()
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault()
      const result = validate()
      if (!result.ok) {
        if (result.firstError === 'username' && usernameRef.current) {
          usernameRef.current.focus()
        } else if (result.firstError === 'password' && passwordRef.current) {
          passwordRef.current.focus()
        }
        return
      }
      // TODO: fluxo real de login
    },
    [validate]
  )

  const handleUsernameChange = useCallback(
    (e) => {
      setUsername(e.target.value)
      if (errors.username) clearFieldError('username')
    },
    [setUsername, errors.username, clearFieldError]
  )

  const handlePasswordChange = useCallback(
    (e) => {
      setPassword(e.target.value)
      if (errors.password) clearFieldError('password')
    },
    [setPassword, errors.password, clearFieldError]
  )

  const sectionTitleId = 'login-title'
  const globalMessageId = 'login-global-message'

  return (
    <section
      className="login-page"
      aria-labelledby={sectionTitleId}
      aria-describedby={message ? globalMessageId : undefined}
    >
      <motion.div
        className="login-form"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -30 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? {} : { duration: 0.6, ease: 'easeOut' }}
      >
        <h1 id={sectionTitleId} className="login-form__title">Login</h1>

        {message && (
          <p
            id={globalMessageId}
            className={`login-form__message login-form__message--${messageType}`}
            aria-live="polite"
            role="status"
          >
            {message}
          </p>
        )}

        <form className="login-form__form" onSubmit={handleLogin} noValidate>
          <div className="login-form__group">
            <label htmlFor="username">Username</label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              name="username"
              minLength={3}
              maxLength={30}
              autoComplete="username"
              inputMode="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={username}
              onChange={handleUsernameChange}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? 'username-error' : undefined}
              required
            />
            {errors.username && (
              <p id="username-error" className="login-form__error" role="status" aria-live="polite">
                {errors.username}
              </p>
            )}
          </div>

          <div className="login-form__group">
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              name="password"
              minLength={8}
              maxLength={64}
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              required
            />
            {errors.password && (
              <p id="password-error" className="login-form__error" role="status" aria-live="polite">
                {errors.password}
              </p>
            )}
            <div className="login-form__forgot">
              <button type="button" className="link-like" aria-label="Recuperar senha">Forgot Password?</button>
            </div>
          </div>

          <button type="submit" className="login-form__button">
            Sign in
          </button>
        </form>

        <div className="login-form__social-message" aria-hidden="true">
          <div className="line" />
          <p className="message">Login with social accounts</p>
          <div className="line" />
        </div>

        <div className="login-form__social-icons">
          <button type="button" className="icon" aria-label="Entrar com e-mail">
            <Mail size={32} strokeWidth={1.5} />
          </button>
          <button type="button" className="icon" aria-label="Entrar com X (Twitter)">
            <Twitter size={32} />
          </button>
          <button type="button" className="icon" aria-label="Entrar com GitHub">
            <Github size={32} />
          </button>
        </div>

        <p className="login-form__signup">
          Don&apos;t have an account?{' '}
          <a href="#" rel="noopener">Sign up</a>
        </p>
      </motion.div>
    </section>
  )
}

export default memo(LoginForm)