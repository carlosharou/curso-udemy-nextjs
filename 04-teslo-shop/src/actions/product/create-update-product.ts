'use server';

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform( val => Number(val.toFixed(2)) ),
    inStock: z.coerce
        .number()
        .min(0)
        .transform( val => Number(val.toFixed(2)) ),
    categoryId: z.string().uuid(),
    sizes: z.coerce
        .string()
        .transform( val => val.split(',') ),
    tags: z.string(),
    gender: z.nativeEnum(Gender)
});


export const createUpdateProduct = async( formData: FormData ) => {
    const data = Object.fromEntries(formData);
    const productParse = productSchema.safeParse(data);

    if (!productParse.success) {
        console.log(productParse.error);
        return {
            ok: false
        }
    }

    const product = productParse.data;
    product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim();

    const { id, ...rest} = product;


    try {
        const prismaTx = await prisma.$transaction(async () => {
            let productPrisma: Product;
            const tagsArray = rest.tags.split(',').map( tag => tag.trim().toLowerCase());

            if ( id ) {
                //actualizar
                productPrisma = await prisma.product.update({
                    where: {
                        id
                    }, data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                });
            } else {
                //crear
                productPrisma = await prisma.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                });
            }

            
            // proceso de carga y guardado de imagenes
            // recorrer las imagenes y guardarlas
            if ( formData.getAll('images') ) {
                const images = await uploadImages(formData.getAll('images') as File[]);
                
                if (!images) {
                    throw new Error('No se pudo cargar las imágenes, rollingback');
                }

                await prisma.productImage.createMany({
                    data: images.map( image => ({
                        url: image!,
                        productId: productPrisma.id
                    }))
                });
            }


            return {
                productPrisma
            }
        });


        // Todo: RevalidatePaths
        revalidatePath(`/admin/products`);
        revalidatePath(`/admin/product/${prismaTx.productPrisma.slug}`);
        revalidatePath(`/products/${prismaTx.productPrisma.slug}`);


        return {
            ok: true,
            product: prismaTx.productPrisma
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo actualizar'
        }
    }
}


const uploadImages = async( images: File[] ) => {
    try {
        const uploadPromises = images.map( async( image ) => {
            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then( resp => resp.secure_url);
            } catch (error) {
                console.log(error);
                return null;
            }
        });


        const uploadedImages = await Promise.all( uploadPromises );
        return uploadedImages;
    } catch (error) {
        console.log(error);
        return null;
    }
}