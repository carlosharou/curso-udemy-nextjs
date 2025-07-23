'use server';

import prisma from "@/lib/prisma";

export const getUserAddress = async(userId: string) => {
    try {
        const userAddress = await prisma.userAddress.findUnique({
            where: {
                userId
            }
        });

        if (!userAddress) {
            return {
                ok: true,
                address: null
            };
        }

        const { countryId, address2, ...restAddress } = userAddress;

        return {
            ok: true,
            address: {
                country: countryId,
                address2: address2 ? address2 : '',
                ...restAddress
            }
        }
    } catch (error) {
        return {
            ok: false,
            message: `No se pudo obtener los datos de la dirección: ${error}`
        };
    }
}