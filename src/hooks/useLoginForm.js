import { useState, useCallback } from 'react'

export function useLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const [errors, setErrors] = useState({ username: '', password: '' })

  const clearFieldError = useCallback((key) => {
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }, [])

  const validate = useCallback(() => {
    const next = { username: '', password: '' }
    let firstError = null

    if (username.trim().length < 3) {
      next.username = 'Usuário deve ter pelo menos 3 caracteres.'
      firstError = firstError || 'username'
    }

    if (password.trim().length < 8) {
      next.password = 'A senha deve ter pelo menos 8 caracteres.'
      firstError = firstError || 'password'
    }

    const ok = !next.username && !next.password
    if (!ok) {
      setErrors(next)
      setMessage('')
      setMessageType('error')
      return { ok: false, firstError }
    }

    setErrors({ username: '', password: '' })
    setMessage(`Bem-vindo, ${username}!`)
    setMessageType('success')
    return { ok: true, firstError: null }
  }, [username, password])

  return {
    username,
    setUsername,
    password,
    setPassword,
    message,
    messageType,
    errors,
    validate,
    clearFieldError,
  }
}
