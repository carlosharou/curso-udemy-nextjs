import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: CartProduct[];
    
    getTotalItems: () => number;
    getSummaryInformation: () => {
        subtotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    };

    addProductToCart: ( cartProduct: CartProduct ) => void;
    updateProductQuantity: ( cartProduct: CartProduct, quantity: number ) => void;
    removeProduct: ( CartProduct: CartProduct ) => void;
    clearCart: () => void;
}


export const useCartStore = create<State>()( 
    persist(
        ( set, get ) => ({
            cart: [],

            getTotalItems: () => {
                const { cart } = get();

                return cart.reduce((total, elem) => {
                    return total + elem.quantity;
                }, 0);
            },

            getSummaryInformation: () => {
                const { cart } = get();

                const subtotal = cart.reduce((_subtotal, item) => _subtotal + (item.quantity * item.price), 0);
                const tax = subtotal * 0.16;
                const total = subtotal + tax;
                const itemsInCart = cart.reduce((total, elem) => { return total + elem.quantity; }, 0);

                return { subtotal, tax, total, itemsInCart };
            },
    
            addProductToCart: ( cartProduct: CartProduct ) => {
                const { cart } = get();
    
                // 1. Revisar si existe el producto en la cart con la talla seleccionada
                const existProductInCart = cart.some( (product) => (product.id === cartProduct.id) && (product.size === cartProduct.size) );
    
                if (!existProductInCart) {
                    set({ cart: [...cart, cartProduct] });
                    return;
                }
    
                // 2. El producto existe por talla, ... tengo que incrementarlo
                const updateProduct = cart.map( product => {
                    if ((product.id === cartProduct.id) && (product.size === cartProduct.size)) {
                        return {
                            ...product,
                            quantity: product.quantity + cartProduct.quantity
                        }
                    }
    
                    return product;
                });
    
                set({ cart: updateProduct });
            },

            updateProductQuantity: ( cartProduct: CartProduct, quantity: number ) => {
                const { cart } = get();

                const updateProduct = cart.map( product => {
                    if ((product.id === cartProduct.id) && (product.size === cartProduct.size)) {
                        return {
                            ...product,
                            quantity: quantity
                        }
                    }
    
                    return product;
                });
    
                set({ cart: updateProduct });
            },

            removeProduct: ( cartProduct: CartProduct ) => {
                const { cart } = get();

                const restProductsInCart = cart.filter( (product) => (product.id !== cartProduct.id) || (product.size !== cartProduct.size) );
                set({ cart: restProductsInCart });
            },

            clearCart: () => {
                set({
                    cart: []
                })
            }
        }), {
            name: "shooping-cart"
        }
    )
);