'use server';

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export const paypalCheckPayment = async( transactionId: string ) => {
    const authToken = await getPaypalToken();

    if (!authToken) {
        return {
            ok: false,
            msg: "No se pudo obtener el token de verificación"
        }
    }


    const resp = await verifyPayPalPayment(transactionId, authToken);

    if (!resp) {
        return {
            ok: false,
            msg: `Error al verificar el pago`
        }
    }

    const { status, purchase_units } = resp;
    const { invoice_id: orderId } = purchase_units[0];

    if ( status !== 'COMPLETED' ) {
        return {
            ok: false,
            msg: 'Aún no se ha pagado en el PayPal'
        }
    }

    // Realizar la actualizacion en nuestra base de datos
    try {
        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        });
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: '500 - El pago no se pudo realizar'
        }
    }

    // revalidar el path
    revalidatePath(`/orders/${orderId}`);

    return {
        ok: true
    }
}


const getPaypalToken = async() => {
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';


    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
        'utf-8'
    ).toString('base64');


    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'insomnia/10.3.1',
            Authorization: `Basic ${base64Token}`
        },
        body: new URLSearchParams({grant_type: 'client_credentials'})
    };

    try {
        const result = await fetch(oauth2Url, {
            ...options,
            cache: 'no-store'
        }).then(response => response.json())
            
        return result.access_token;
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: `Error al generar el token: ${error}`
        }
    }
}


const verifyPayPalPayment = async( paypalTransactionId: string, bearerToken: string): Promise<PayPalOrderStatusResponse | null> => {
    const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;


    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'insomnia/10.3.1',
            Authorization: `Bearer ${bearerToken}`
        },
        cache: 'no-store'
    };

    try {
        const result = await fetch(paypalOrderUrl, {
            ...options,
            cache: 'no-store'
        }).then(response => response.json());

        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}