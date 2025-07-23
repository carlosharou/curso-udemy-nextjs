'use server';

import prisma from "@/lib/prisma";


export const getInStockBySlug = async( slug: string ): Promise<number> => {
    try {
        const producto = await prisma.product.findFirst({
            select: {
                inStock: true
            },
            where: {
                slug: slug
            }
        });

        return producto?.inStock ?? 0;
    } catch (error) {
        throw new Error(`Error al obtener el stock del producto por el slug. Error ${error}`);
    }
}