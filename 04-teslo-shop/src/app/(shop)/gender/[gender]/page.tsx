export const revalidate = 60;


import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/interfaces";
import { redirect } from "next/navigation";


interface Props {
    params: Promise<{ gender: Gender }>,
    searchParams: Promise<{ [page: string]: string }>
}

const labels: Record<Gender, string> = {
    'men': 'Hombres',
    'women': 'Mujeres',
    'kid': 'Niños',
    'unisex': 'Todos'
}

const GenderId = async({ params, searchParams }: Props) => {
    const { gender } = await params;
    const { page } = await searchParams;


    const _page = page ? parseInt(page) : 1;
    const { products, totalPages } = await getPaginatedProductsWithImages({ page: _page, gender });

    if (products.length == 0) {
        redirect(`/gender/${gender}`);
    }


    return (
        <div className="">
            <Title
                title={`Artículos para ${labels[gender]}`}
                subtitle={`Todos los Productos de ${labels[gender]}`}
                className="mb-2"
            />
            
            <ProductGrid products={products} />
            <Pagination totalPages={totalPages} />
        </div>
    );
}

export default GenderId;