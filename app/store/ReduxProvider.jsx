'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './store'
import { setCart } from './cartSlice'

export default function ReduxProvider({ children }) {
  const storeRef = useRef(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    // Restore cart from localStorage on mount
    try {
      const saved = localStorage.getItem('ks_cart')
      if (saved) {
        storeRef.current.dispatch(setCart(JSON.parse(saved)))
      }
    } catch {}

    // Persist cart items to localStorage on every change
    const unsubscribe = storeRef.current.subscribe(() => {
      try {
        const { items } = storeRef.current.getState().cart
        localStorage.setItem('ks_cart', JSON.stringify(items))
      } catch {}
    })

    return unsubscribe
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
