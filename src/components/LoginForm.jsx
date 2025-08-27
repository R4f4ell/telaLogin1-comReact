import React, { memo, useCallback, useRef, useState, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Github, Twitter, Mail, Eye, EyeOff } from 'lucide-react'
import { useLoginForm } from '../hooks/useLoginForm'
import './loginForm.scss'

function Toast({ open, onClose, message = '', type = 'error' }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div
      className={`app-toast ${type === 'error' ? 'app-toast--error' : 'app-toast--success'}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {message}
    </div>,
    document.body
  )
}

const LoginForm = () => {
  const {
    username, setUsername,
    password, setPassword,
    errors, validate, clearFieldError,
    submitting, setSubmitting,
  } = useLoginForm()

  const prefersReducedMotion = useReducedMotion()
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  const [showPwd, setShowPwd] = useState(false)
  const [toast, setToast] = useState({ open: false, type: 'error', message: '' })

  const openToast = useCallback((type, message) => setToast({ open: true, type, message }), [])
  const closeToast = useCallback(() => setToast(t => ({ ...t, open: false })), [])

  const handleLogin = useCallback(async (e) => {
    e.preventDefault()
    if (submitting) return

    const result = validate()
    if (!result.ok) {
      if (result.firstError === 'username' && usernameRef.current) usernameRef.current.focus()
      else if (result.firstError === 'password' && passwordRef.current) passwordRef.current.focus()
      openToast('error', 'Erro ao fazer login')
      return
    }

    try {
      setSubmitting(true)
      openToast('success', 'Login efetuado com sucesso')
      setUsername('')
      setPassword('')
      if (usernameRef.current) usernameRef.current.blur()
      if (passwordRef.current) passwordRef.current.blur()
    } finally {
      setSubmitting(false)
    }
  }, [validate, submitting, openToast, setSubmitting, setUsername, setPassword])

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value)
    if (errors.username) clearFieldError('username')
  }, [setUsername, errors.username, clearFieldError])

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value)
    if (errors.password) clearFieldError('password')
  }, [setPassword, errors.password, clearFieldError])

  const titleId = useId()

  return (
    <>
      <section className="login-page" aria-labelledby={titleId}>
        <motion.div
          className="login-form"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -30 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.6, ease: 'easeOut' }}
        >
          <h1 id={titleId} className="login-form__title">Login</h1>

          <form className="login-form__form" onSubmit={handleLogin} noValidate aria-busy={submitting}>
            {/* Username */}
            <div className="login-form__group">
              <div className="input-container">
                <input
                  ref={usernameRef}
                  type="text"
                  id="username"
                  name="username"
                  minLength={3}
                  maxLength={20}
                  autoComplete="username"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={username}
                  onChange={handleUsernameChange}
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  placeholder=" "
                  required
                />
                <label htmlFor="username" className="label">Usuário</label>
                <span className="underline" aria-hidden="true" />
              </div>

              {errors.username && (
                <p id="username-error" className="login-form__error" role="status" aria-live="polite">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="login-form__group">
              <div className="input-container input-container--with-toggle">
                <input
                  ref={passwordRef}
                  type={showPwd ? 'text' : 'password'}
                  id="password"
                  name="password"
                  minLength={8}
                  maxLength={8}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  placeholder=" "
                  required
                />
                <label htmlFor="password" className="label">Senha</label>
                <span className="underline" aria-hidden="true" />
                <button
                  type="button"
                  className="toggle"
                  aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPwd}
                  onClick={() => setShowPwd((v) => !v)}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p id="password-error" className="login-form__error" role="status" aria-live="polite">
                  {errors.password}
                </p>
              )}

              <div className="login-form__forgot">
                <button type="button" className="link-like" aria-label="Recuperar senha">Esqueci minha senha</button>
              </div>
            </div>

            <button type="submit" className="login-form__button" disabled={submitting}>
              Entrar
            </button>
          </form>

          <div className="login-form__social-message" aria-hidden="true">
            <div className="line" />
            <p className="message">Entrar com redes sociais</p>
            <div className="line" />
          </div>

          <div className="login-form__social-icons" aria-label="Ações de login social">
            <button type="button" className="icon" aria-label="Entrar com e-mail"><Mail size={24} strokeWidth={1.5} /></button>
            <button type="button" className="icon" aria-label="Entrar com X (Twitter)"><Twitter size={24} /></button>
            <button type="button" className="icon" aria-label="Entrar com GitHub"><Github size={24} /></button>
          </div>

          <p className="login-form__signup">
            Não tem conta?{' '}
            <a href="/signup" rel="noopener">Criar conta</a>
          </p>
        </motion.div>
      </section>

      <Toast open={toast.open} onClose={closeToast} message={toast.message} type={toast.type} />
    </>
  )
}

export default memo(LoginForm)