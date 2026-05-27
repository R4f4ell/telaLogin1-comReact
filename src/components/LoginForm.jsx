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
            <h1 id={titleId} className="login-form__title">Welcome back</h1>
            <p className="login-form__subtitle">Please enter your details.</p>
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
                  placeholder="Enter your email"
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
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
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
                  <span>Remember for 30 days</span>
                </label>

                <button type="button" className="link-like" aria-label="Forgot password">Forgot password</button>
              </div>
            </div>

            <button type="submit" className="login-form__button" disabled={submitting}>
              Sign in
            </button>
          </form>

          <button type="button" className="login-form__google">
            <span aria-hidden="true">G</span>
            Sign in with Google
          </button>

          <p className="login-form__signup">
            Don't have an account?{' '}
            <a href="/signup" rel="noopener">Sign up</a>
          </p>
        </Motion.div>
      </section>

      <Toast open={toast.open} onClose={closeToast} message={toast.message} type={toast.type} />
    </>
  )
}

export default memo(LoginForm)
