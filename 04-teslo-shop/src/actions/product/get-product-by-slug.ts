'use server';

import prisma from "@/lib/prisma";

export const getProductBySlug = async(slug: string) => {
    try {
        const producto = await prisma.product.findFirst({
            include: {
                productImage: true
            }, where: {
                slug: slug
            }
        });


        if (!producto) {
            return null;
        }

        return {
            ...producto,
            images: producto.productImage.map( image => image.url )
        };
    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener producto por slug');
    }
}