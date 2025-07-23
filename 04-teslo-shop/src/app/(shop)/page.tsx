export const revalidate = 60;


import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";


interface Props {
    searchParams: Promise<{ [page: string]: string | undefined }>
}


const Home = async({ searchParams }: Props) => {
    const { page } = await searchParams;
    const _page = page ? parseInt(page) : 1;
    const { products, totalPages } = await getPaginatedProductsWithImages({ page: _page });

    if (products.length == 0) {
        redirect('/');
    }


    return (
        <div className="">
            <Title
                title="Tienda"
                subtitle="Todos los productos"
                className="mb-2"
            />

            <ProductGrid products={products} />
            <Pagination totalPages={totalPages} />
        </div>
    );
}

export default Home;