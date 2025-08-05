import { getProductBySlug, getCategories } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
    params: {
        slug: string;
    }
}

const ProductPage = async({ params }: Props) => {
    const { slug } = await params;

    const [ product, categories ] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ]);


    if (!product && (slug !== 'new')) {
        redirect('/admin/products');
    }


    const title = (slug === 'new') ? 'Nuevo Producto' : 'Editar Producto'


    return (
        <>
            <Title title={ title } />
            <ProductForm 
                product={ product ?? {} } 
                categories={ categories }
            />
        </>
    );
}

export default ProductPage;