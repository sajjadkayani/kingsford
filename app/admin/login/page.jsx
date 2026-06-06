'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push(from)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0e0c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Jost, sans-serif',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: '#1a1915',
        border: '1px solid #2a2820',
        borderRadius: '12px',
        padding: '2.5rem',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block',
            background: '#c9a96e',
            color: '#0f0e0c',
            fontWeight: 700,
            fontSize: '0.85rem',
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            lineHeight: '44px',
            textAlign: 'center',
            marginBottom: '0.75rem',
          }}>KS</div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f5f0e8', margin: 0 }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#555', margin: '0.35rem 0 0' }}>
            Kingsford Sleep
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              required
              style={{
                background: '#141310',
                border: `1px solid ${error ? '#7a2020' : '#2a2820'}`,
                borderRadius: '6px',
                color: '#f5f0e8',
                padding: '0.65rem 0.85rem',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#2a1010',
              border: '1px solid #7a2020',
              color: '#e05555',
              borderRadius: '6px',
              padding: '0.6rem 0.85rem',
              fontSize: '0.82rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              background: '#c9a96e',
              color: '#0f0e0c',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.6 : 1,
              transition: 'opacity 0.15s',
              marginTop: '0.25rem',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#444' }}>
          <a href="/" style={{ color: '#666', textDecoration: 'none' }}>← Back to site</a>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
