'use client';

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const OrderSummary = () => {
    const getSummaryInformation = useCartStore(useShallow(state => state.getSummaryInformation()));
    const [ loaded, setLoaded ] = useState(false);


    useEffect(() => {
        setLoaded(true);
    }, [])


    if (!loaded) {
        return <p>Loading...</p>
    }

    
    return (
        <>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">{ getSummaryInformation.itemsInCart } artículo{ getSummaryInformation.itemsInCart > 1 ? 's' : '' }</span>

                <span>Subtotal</span>
                <span className="text-right">{ currencyFormat(getSummaryInformation.subtotal) }</span>

                <span>Impuestos (16%)</span>
                <span className="text-right">{ currencyFormat(getSummaryInformation.tax) }</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{ currencyFormat(getSummaryInformation.total) }</span>
            </div>

            <div className="mt-5 mb-2 w-full">
                <Link 
                    className="flex btn-primary justify-center"
                    href="/checkout/address">
                    Checkout
                </Link>
            </div>
        </>
    );
}

export default OrderSummary;