'use server';

import prisma from "@/lib/prisma";

export const setTransactionId = async(order: string, transactionId: string) => {
    try {
        const orden = await prisma.order.update({
            data: {
                transactionId: transactionId
            },
            where: {
                id: order
            }
        });


        if (!orden) {
            return {
                ok: false,
                msg: `La orden con el id: ${order} no existe`
            }
        }


        return {
            ok: true,
            msg: 'Orden actualizada satisfactoriamente'
        }
    } catch (error) {
        return {
            ok: false,
            msg: `Error al guardar la transacion: ${transactionId} en la orden: ${order}. - ${error}`
        }
    }
}