import { defineStore } from 'pinia'


export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
    shippingFee: 0,
    // item_id, item_qty, item_price, checked
  }),
  actions: {
    addItem(item_id, item_qty, item_price) {
      if (this.cartItems.find((item) => item.item_id === item_id)) {
        this.cartItems.find((item) => item.item_id === item_id).item_qty += item_qty
      } else {
        this.cartItems.push({ item_id: item_id, item_qty: item_qty, item_price: item_price, checked: false })
      }
      console.log(this.cartItems)
    },
    removeItem(item_id) {
      this.cartItems = this.cartItems.filter((item) => item.item_id !== item_id)
    },
    clearCart() {
      this.cartItems = []
    },
    updateChecked(item_id, checked) {
      console.log(item_id, checked)
      this.cartItems.find((item) => item.item_id === item_id).checked = !this.cartItems.find((item) => item.item_id === item_id).checked
    },
    updateCheckedAll(checked) {
      this.cartItems.forEach((item) => {
        item.checked = checked
      })
    }
  },
  getters: {
    totalItems: (state) => state.cartItems.length,
    totalPrice: (state) => state.cartItems.reduce((total, item) => total + item.item_price * item.item_qty, 0),
    totalCheckedPrice: (state) => state.cartItems.filter((item) => item.checked).reduce((total, item) => total + item.item_price * item.item_qty, 0),
  },
  persist: true
})


