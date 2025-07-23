'use server';

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";


interface PaginationOptions {
    page?: number;
    elem?: number;
    gender?: Gender;
}


export const getPaginatedProductsWithImages = async({
    page = 1,
    elem = 12,
    gender
}: PaginationOptions) => {
    if (isNaN(Number(page)))
        page = 1;
    if (page < 1)
        page = 1;
    if (isNaN(Number(elem)))
        elem = 12;
    

    try {
        // 1. Obtener los productps
        const products = await prisma.product.findMany({
            take: elem,
            skip: ( page - 1) * elem,
            include: {
                productImage: {
                    take: 2,
                    select: {
                        url: true
                    }
                }
            },
            where: {
                gender: gender
            }
        });


        // 2. Obtener el total de paginas
        const totalCount = await prisma.product.count({
            where: {
                gender: gender
            }
        });
        const totalPages = Math.ceil(totalCount / elem);


        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map( product => ({
                ...product,
                images: product.productImage.map( image => image.url )
            }))
        }
    } catch (error) {
        throw new Error(`No se pudo cargar los productos: ${error}`);
    }
}