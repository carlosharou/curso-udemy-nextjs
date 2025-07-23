'use server';

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";


interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size
}


export const pagarOrder = async( producIds: ProductToOrder[], address: Address ) => {
    const session = await auth();
    const userId = session?.user.id;


    if (!userId) {
        return {
            ok: false,
            message: 'No hay session de usuario'
        }
    }


    // nota: recuerden que podemos llevar 2+ productos con el mismo ID
    const productsDb = await prisma.product.findMany({
        where: {
            id: {
                in: producIds.map( p => p.productId )
            }
        }
    });


    // calcular los montos // orden
    const itemsInOrder = producIds.reduce(( count, p ) => count + p.quantity, 0);

    // los totales de tax, subtotal
    const { subtotal, tax, total } = producIds.reduce(( totals, item ) => {
        const productQuantity = item.quantity;
        const product = productsDb.find( p => p.id === item.productId);

        if (!product) {
            throw new Error(`${ item.productId } no existe - 500`);
        }

        const subtotal = product.price * productQuantity;
        totals.subtotal += subtotal;
        totals.tax += subtotal * 0.16;
        totals.total += subtotal * 1.16;

        return totals;
    }, { subtotal: 0, tax: 0, total: 0 });

    try {
        // crear la transaccion de base de datos con prisma
        const prismaTx = await prisma.$transaction( async(tx) => {
            // 1. actualizar el stock de los productos
            const updatedProductsPromises = productsDb.map(( p1 ) => {
                // acumular los valores
                const productQuantity = producIds.filter(
                    p2 => p2.productId === p1.id
                ).reduce( ( acc, item) => item.quantity + acc, 0 );

                if (productQuantity === 0) {
                    throw new Error(`${p1.id} no tiene cantidad definida`);
                }

                return tx.product.update({
                    where: {
                        id: p1.id
                    }, data: {
                        //inStock: p1.inStock - productQuantity // no hacer
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                });
            });


            const updateProducts = await Promise.all( updatedProductsPromises );

            // Verificar valores negativos en las existencias = no hay stock
            updateProducts.forEach( p => {
                if ( p.inStock < 0 ) {
                    throw new Error(`${p.title} no tiene inventario suficiente`);
                }
            } );


            // 2. crear la orden y el detalle
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subtotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: producIds.map( p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: productsDb.find( p2 => p2.id === p.productId )?.price ?? 0
                            }))
                        }
                    },

                    OrderAddress: {
                        create: {
                            firstName: address.firstName,
                            lastName: address.lastName,
                            address: address.address,
                            address2: address.address2,
                            postalCode: address.postalCode,
                            city: address.city,
                            phone: address.phone,
                            countryId: address.country
                        }
                    }
                }
            });

            // validar, si el price es cero, lanzar un error

            // 3. crear la direccion de la orden
            return {
                orden: order
            }
        });

        
        return {
            ok: true,
            order: prismaTx.orden,
            prismaTx: prismaTx
        }
    } catch (error) {
        return {
            ok: false,
            message: `Error al pagar: ${error}`
        }
    }
}