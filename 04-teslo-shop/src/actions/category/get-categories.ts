'use server';

import prisma from "@/lib/prisma";


export const getCategories = async() => {
    try {
        const categories = await prisma.category.findMany({
            where: {},
            orderBy: {
                name: 'asc'
            }
        });

        return categories;
    } catch(e) {
        throw new Error(`Error al obtener las categorias: ${e}`);
    }
}