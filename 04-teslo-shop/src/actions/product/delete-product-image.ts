'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const deleteProductImage = async(imageId: number, imageUrl: string) => {
    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            error: 'No se puede borrar imagenes de filesystem'
        }
    }

    const imageName = imageUrl.split('/')
        .pop()
        ?.split('.')[0] ?? '';

    try {
        await cloudinary.uploader.destroy(imageName);

        const deletedImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            select: {
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        });


        revalidatePath(`/admin/products`);
        revalidatePath(`/admin/product/${deletedImage.product.slug}`);
        revalidatePath(`/product/${deletedImage.product.slug}`);
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "No se pudo eliminar la imagen"
        }
    }
}