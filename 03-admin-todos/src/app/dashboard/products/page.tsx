import { ProductCard } from "@/products";
import { products } from "@/products/data/products";

const ProductsPage = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {
                products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))
            }
        </div>
    );
}

export default ProductsPage;