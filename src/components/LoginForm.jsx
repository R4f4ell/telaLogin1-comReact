import React, { memo, useCallback, useRef, useState, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
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

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
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
  const [remember, setRemember] = useState(false)
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
        <Motion.div
          className="login-form"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -30 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.6, ease: 'easeOut' }}
        >
          <div className="login-form__header">
            <h1 id={titleId} className="login-form__title">Bem-vindo de volta</h1>
            <p className="login-form__subtitle">Acesse sua conta para continuar.</p>
          </div>

          <form className="login-form__form" onSubmit={handleLogin} noValidate aria-busy={submitting}>
            <div className="login-form__group">
              <div className="input-container">
                <input
                  ref={usernameRef}
                  type="email"
                  id="email"
                  name="email"
                  minLength={3}
                  maxLength={80}
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={username}
                  onChange={handleUsernameChange}
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              {errors.username && (
                <p id="username-error" className="login-form__error" role="status" aria-live="polite">
                  {errors.username}
                </p>
              )}
            </div>

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
                  placeholder="Digite sua senha"
                  required
                />
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

              <div className="login-form__options">
                <label className="login-form__remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Lembrar por 30 dias</span>
                </label>

                <button type="button" className="link-like" aria-label="Recuperar senha">Esqueci minha senha</button>
              </div>
            </div>

            <button type="submit" className="login-form__button" disabled={submitting}>
              Entrar
            </button>
          </form>

          <button type="button" className="login-form__google">
            <GoogleLogo />
            Entrar com Google
          </button>

          <p className="login-form__signup">
            Não tem uma conta?{' '}
            <a href="/signup" rel="noopener">Cadastre-se</a>
          </p>
        </Motion.div>
      </section>

      <Toast open={toast.open} onClose={closeToast} message={toast.message} type={toast.type} />
    </>
  )
}

export default memo(LoginForm)
