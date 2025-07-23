import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';


async function main() {
    const { categories, products, users } = initialData;


    // 1. Borrar registro previos
    /*await Promise.all([
        prisma.productImage.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany()
    ]);*/
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    await prisma.category.deleteMany();

    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    
    await prisma.country.deleteMany();


    // 2. Insertar Categorias
    const categoriesData = categories.map(category => ({ 
        name: category
    }));

    await prisma.category.createMany({
        data: categoriesData
    });


    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce(( map, category ) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);// < string=name, string=>id >


    // 3. Insertar Productos
    products.forEach( async(product) => {
        const { type, images, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        });


        // images
        const imagesData = images.map( image => ({
            url: image,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData
        });
    });


    // 4. Insertar Usuarios
    await prisma.user.createMany({
        data: users
    });


    // 5. Insertar Countries
    await prisma.country.createMany({
        data: countries
    });


    console.log('Seed ejecutado correctamente');
}


(() => {
    if (process.env.NODE_ENV === 'production')
        return;

    main();
})();