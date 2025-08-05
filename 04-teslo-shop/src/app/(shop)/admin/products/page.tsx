export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, Title } from '@/components';
import ProductImage from '@/components/product/product-image/ProductImage';
import { currencyFormat } from '@/utils';
import Link from 'next/link';


interface Props {
    searchParams: Promise<{ [page: string]: string | undefined }>
}


const Orders = async({ searchParams }: Props) => {
    const { page } = await searchParams;
    const _page = page ? parseInt(page) : 1;
    const { products, totalPages } = await getPaginatedProductsWithImages({ page: _page });


    return (
        <>
            <Title title="Mantenimiento de Productos" />

            <div className='flex justify-end mb-5'>
                <Link href="/admin/product/new" className='btn-primary'>
                    Nuevo Producto
                </Link>
            </div>

            <div className="mb-10">
                <table className="min-w-full">
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Imagen</th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Titulo</th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Precio</th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Genero</th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Inventario</th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Tallas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products?.map( (_product) => (
                                <tr 
                                    key={_product.id}
                                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <Link href={`/product/${_product.slug}`}>
                                            <ProductImage
                                                src={ _product.productImage[0]?.url }
                                                width={ 80 }
                                                height={ 80 }
                                                alt={ _product.title }
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        </Link>
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        <Link 
                                            href={`/admin/product/${_product.slug}`}
                                            className='hover:underline'>
                                            {_product.title}
                                        </Link>
                                    </td>
                                    <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                                        { currencyFormat(_product.price) }
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        { _product.gender }
                                    </td>
                                    <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                                        { _product.inStock }
                                    </td>
                                    <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                                        { _product.sizes.join(', ') }
                                    </td>
                                </tr>
                            )) 
                        }
                    </tbody>
                </table>
            </div>
            <Pagination totalPages={totalPages} />
        </>
    );
}

export default Orders;