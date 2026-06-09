'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const WELCOME = "Hi! I'm the Kingsford Sleep assistant. Ask me anything about our beds — sizes, fabrics, pricing, delivery, or which style suits you best."

export default function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150)
      return () => clearTimeout(t)
    }
  }, [open])

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) return null

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || data.error || 'Sorry, something went wrong.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having connection issues. Please email us at hello@kingsfordsleep.co.uk" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Chat panel ── */}
      {open && (
        <div id="ks-chat-panel" style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 9998,
          width: 348, maxWidth: 'calc(100vw - 32px)',
          height: 500, maxHeight: 'calc(100svh - 120px)',
          background: '#0f0e0c', border: '1px solid #2a2820',
          borderRadius: 14, display: 'flex', flexDirection: 'column',
          boxShadow: '0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,110,0.08)',
          animation: 'ksSlideUp 0.2s cubic-bezier(0.22,1,0.36,1)',
        }}>

          {/* Header */}
          <div style={{
            padding: '0.85rem 1rem', background: '#141310',
            borderRadius: '14px 14px 0 0', borderBottom: '1px solid #2a2820',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#1e1c18', border: '1px solid #2a2820',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: '#c9a96e', fontFamily: 'Jost, sans-serif',
              }}>KS</div>
              <div>
                <div style={{ color: '#f5f0e8', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Jost, sans-serif', lineHeight: 1.2 }}>
                  KS Assistant
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />
                  <span style={{ color: '#666', fontSize: '0.68rem', fontFamily: 'Jost, sans-serif' }}>AI · usually instant</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none', border: '1px solid #2a2820', borderRadius: 6,
                cursor: 'pointer', color: '#666', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#f5f0e8'}
              onMouseLeave={e => e.currentTarget.style.color = '#666'}
              aria-label="Close chat"
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '0.85rem 0.85rem 0.5rem',
            display: 'flex', flexDirection: 'column', gap: '0.65rem',
            scrollbarWidth: 'thin', scrollbarColor: '#2a2820 transparent',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <div style={{
                  maxWidth: '88%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  background: msg.role === 'user' ? '#c9a96e' : '#1a1814',
                  color: msg.role === 'user' ? '#0f0e0c' : '#d4c9b8',
                  fontSize: '0.82rem', lineHeight: 1.55,
                  fontFamily: 'Jost, sans-serif',
                  border: msg.role === 'assistant' ? '1px solid #2a2820' : 'none',
                  fontWeight: msg.role === 'user' ? 500 : 400,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.65rem 1rem', borderRadius: '12px 12px 12px 3px',
                  background: '#1a1814', border: '1px solid #2a2820',
                  display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#c9a96e',
                      display: 'inline-block',
                      animation: `ksDot 1.2s ease-in-out infinite`,
                      animationDelay: `${i * 0.18}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions — show only at start */}
          {messages.length === 1 && !loading && (
            <div style={{ padding: '0 0.85rem 0.65rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', flexShrink: 0 }}>
              {['What bed styles do you have?', 'How much do beds cost?', 'How long does delivery take?'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50) }}
                  style={{
                    background: 'none', border: '1px solid #2a2820', borderRadius: 20,
                    color: '#888', fontSize: '0.72rem', padding: '4px 10px',
                    cursor: 'pointer', fontFamily: 'Jost, sans-serif',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a96e'; e.currentTarget.style.color = '#c9a96e' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2820'; e.currentTarget.style.color = '#888' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div style={{
            padding: '0.65rem', borderTop: '1px solid #2a2820',
            display: 'flex', gap: '0.45rem', flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Ask me anything…"
              disabled={loading}
              style={{
                flex: 1, background: '#141310', border: '1px solid #2a2820',
                borderRadius: 8, color: '#f5f0e8', padding: '0.52rem 0.8rem',
                fontSize: '0.82rem', outline: 'none', fontFamily: 'Jost, sans-serif',
                opacity: loading ? 0.5 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading ? '#c9a96e' : '#1a1814',
                border: '1px solid',
                borderColor: input.trim() && !loading ? '#c9a96e' : '#2a2820',
                borderRadius: 8, cursor: input.trim() && !loading ? 'pointer' : 'default',
                width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.15s',
              }}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? '#0f0e0c' : '#444'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 58, height: 58, borderRadius: '50%',
          background: open ? '#1a1814' : '#c9a96e',
          border: open ? '2px solid #c9a96e' : '2px solid #c9a96e',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(201,169,110,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(201,169,110,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,169,110,0.3)' }}
        aria-label={open ? 'Close chat' : 'Chat with our AI assistant'}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0f0e0c">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.06L2 22l4.94-1.38C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.66 0-3.21-.47-4.54-1.28l-.32-.19-3.3.92.93-3.3-.19-.32C3.47 15.21 3 13.66 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9zm5-6.5c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.61.14-.18.27-.7.9-.86 1.08-.16.18-.32.2-.59.07-.28-.14-1.16-.43-2.21-1.37-.82-.73-1.37-1.63-1.53-1.9-.16-.27-.02-.42.12-.56.12-.12.28-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.03-.22-.53-.45-.46-.62-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.83c.14.18 1.93 2.96 4.68 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.11-.25-.18-.53-.32z"/>
          </svg>
        )}
      </button>

      <style>{`
        @keyframes ksSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes ksDot {
          0%, 60%, 100% { opacity: 0.25; transform: scale(0.75); }
          30%           { opacity: 1;    transform: scale(1);    }
        }
        @media (max-width: 540px) {
          #ks-chat-panel {
            bottom: 80px !important;
            right: 8px !important;
            left: 8px !important;
            width: auto !important;
            max-width: none !important;
            height: calc(100svh - 96px) !important;
            max-height: none !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </>
  )
}
