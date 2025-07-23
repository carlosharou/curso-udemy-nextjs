'use server';

import prisma from "@/lib/prisma";

export const deleteUserAddress = async(userId: string) => {
    try {
        const deleteAddress = await prisma.userAddress.delete({
            where: {
                userId
            }
        });

        return {
            ok: true,
            address: deleteAddress
        }
    } catch (error) {
        return {
            ok: false,
            message: `No se pudo borrar dirección: ${error}`
        }
    }
}