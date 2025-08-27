import { useState, useCallback } from 'react'

export function useLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ username: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const clearFieldError = useCallback((key) => {
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }, [])

  const validate = useCallback(() => {
    const u = (username || '').trim()
    const p = password || ''

    const next = { username: '', password: '' }
    let firstError = null

    if (u.length < 3 || u.length > 20) {
      next.username = 'Usuário deve ter entre 3 e 20 caracteres.'
      firstError = firstError || 'username'
    }
    if (p.length !== 8) {
      next.password = 'A senha deve ter exatamente 8 caracteres.'
      firstError = firstError || 'password'
    }

    const ok = !next.username && !next.password
    if (!ok) {
      setErrors(next)
      return { ok: false, firstError }
    }
    setErrors({ username: '', password: '' })
    return { ok: true, firstError: null }
  }, [username, password])

  return {
    username, setUsername,
    password, setPassword,
    errors, validate, clearFieldError,
    submitting, setSubmitting,
  }
}