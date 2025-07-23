'use client';

import { pagarOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const PlaceOrder = () => {
    const [ loaded, setLoaded ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const address = useAddressStore( state => state.address );
    const getSummaryInformation = useCartStore(useShallow(state => state.getSummaryInformation()));
    const [ isPagando, setIsPagando ] = useState(false);
    const cart = useCartStore( state => state.cart );
    const clearCart = useCartStore( state => state.clearCart );
    const router = useRouter();


    useEffect(() => {
        setLoaded(true);
    }, []);


    const handlerPagar = async() => {
        setIsPagando(true);

        const productsToOrder = cart.map( _product => ({
            productId: _product.id,
            quantity: _product.quantity,
            size: _product.size
        }));

        
        const resp = await pagarOrder(productsToOrder, address);

        if (!resp.ok) {
            setIsPagando(false);
            setErrorMessage(resp.message ? resp.message : 'Falta mensaje de error');
            return;
        }

        clearCart();
        router.replace('/orders/'+resp.order?.id);
    }


    if (!loaded) {
        return <p>Cargando...</p>
    }


    return (
        <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{ address.firstName } { address.lastName }</p>
                <p>{ address.address }</p>
                <p>{ address.address2 }</p>
                <p>{ address.postalCode }</p>
                <p>{ address.city }, { address.country }</p>
                <p>{ address.phone }</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>
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
                {/* Disclaimer */}
                <p className="mb-5">
                    <span className="text-xs">Al hacer clic en &quot;Pagar&quot;, aceptas nuestros <Link href="#" className="underline">términos y condiciones</Link> y <Link href="#" className="underline">política de privacidad</Link></span>
                </p>

                <p className="text-red-500">{ errorMessage }</p>

                <button 
                    className={clsx({
                        "btn-primary": !isPagando,
                        "btn-disabled": isPagando
                    })}
                    onClick={ handlerPagar }>
                    Pagar
                </button>
            </div>
        </div>
    );
}

export default PlaceOrder;