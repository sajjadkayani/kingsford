import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    cartOpen: false,
  },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find((i) => i.cartId === action.payload.cartId)
      if (existing) {
        existing.price = action.payload.price
        existing.addons = action.payload.addons
        existing.size = action.payload.size
        existing.fabric = action.payload.fabric
        existing.colour = action.payload.colour
      } else {
        state.items.push(action.payload)
      }
      state.cartOpen = true
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.cartId !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
    setCart: (state, action) => {
      state.items = action.payload || []
    },
    openCart: (state) => { state.cartOpen = true },
    closeCart: (state) => { state.cartOpen = false },
    toggleCart: (state) => { state.cartOpen = !state.cartOpen },
  },
})

export const { addItem, removeItem, clearCart, setCart, openCart, closeCart, toggleCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartOpen = (state) => state.cart.cartOpen
export const selectCartCount = (state) => state.cart.items.length
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price, 0)

export default cartSlice.reducer
