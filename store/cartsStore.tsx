
'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface CartItem {
    id: number,
    name: string,
    manufacturer: string,
    price: number,
    imageUrl: string,
    quantity?: number
}

const cartItemsDumbs: CartItem[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    manufacturer: "SoundMax",
    price: 129.00,
    imageUrl: "https://picsum.photos/seed/headphones/300/200"
  },
  {
    id: 2,
    name: "Smartphone X12",
    manufacturer: "TechNova",
    price: 899.00,
    imageUrl: "https://picsum.photos/seed/smartphone/300/200"
  },
  {
    id: 3,
    name: "Gaming Laptop Pro",
    manufacturer: "HyperTech",
    price: 1599.50,
    imageUrl: "https://picsum.photos/seed/laptop/300/200"
  }]

  interface CartContextValues {
    cartItems: CartItem[],
    handleCartRemove: (id: number) => void
  }

const CartContext = createContext<CartContextValues | null>(null);

export const CartProvider = ({children}: {children: ReactNode}) => {
    const [ cartItems, setCartItems] = useState<CartItem[]>([])

    useEffect(() => {
        const cartItemsLocal = localStorage.getItem('cartItems')

        if(!cartItemsLocal) {
            localStorage.setItem('cartItems', JSON.stringify(cartItemsDumbs))
            setCartItems(cartItemsDumbs)

        }else {
            setCartItems(JSON.parse(cartItemsLocal))
        }
        
        
    }, [])
    
    const handleCartRemove = (id: number) => {
        const filterredCartItems = cartItems.filter((item) => item.id !== id)
        localStorage.setItem('cartItems', JSON.stringify(filterredCartItems))
        setCartItems(filterredCartItems)

    }

    return (<CartContext.Provider value={{cartItems, handleCartRemove}}>
        {children}
    </CartContext.Provider>)
}

export const useCart = () => {
    const context = useContext(CartContext);
    if(!context) throw new Error('useCart must be wrapped in CartProvider')
    return context
}